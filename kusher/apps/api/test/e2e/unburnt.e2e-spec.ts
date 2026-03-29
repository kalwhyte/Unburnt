import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Unburnt API — Full Integration Test', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Shared state across tests
  let token: string;
  let userId: string;
  let triggerId: string;
  let smokingLogId: string;
  let cravingLogId: string;
  let quitPlanId: string;
  let quitPlanStepId: string;
  let relapseId: string;
  let notificationId: string;
  let supportContactId: string;

  // ─── Setup & Teardown ─────────────────────────────────────────────────────

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({ where: { email: 'test@unburnt.app' } });
    await app.close();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Auth', () => {
    it('POST /auth/register — creates a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email:     'test@unburnt.app',
          password:  'Password123!',
          firstName: 'Test',
          lastName:  'User',
        })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body.user).toHaveProperty('id');
      token  = res.body.access_token;
      userId = res.body.user.id;
    });

    it('POST /auth/register — rejects duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@unburnt.app', password: 'Password123!', firstName: 'Test', lastName: 'User' })
        .expect(409);
    });

    it('POST /auth/login — returns token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@unburnt.app', password: 'Password123!' })
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
    });

    it('POST /auth/login — rejects wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@unburnt.app', password: 'WrongPassword!' })
        .expect(401);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Users', () => {
    it('GET /users/:id — returns user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(userId);
      expect(res.body).toHaveProperty('email');
    });

    it('PATCH /users/:id — updates user', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Emmanuel', lastName: 'Whyte' })
        .expect(200);

      expect(res.body.firstName).toBe('Emmanuel');
    });

    it('GET /users/:id — 404 for unknown user', async () => {
      await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ONBOARDING
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Onboarding', () => {
    it('GET /onboarding/progress — returns incomplete steps', async () => {
      const res = await request(app.getHttpServer())
        .get('/onboarding/progress')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.isOnboarded).toBe(false);
      expect(res.body.steps.personal).toBe(false);
    });

    it('POST /onboarding/step/personal — saves personal info', async () => {
      await request(app.getHttpServer())
        .post('/onboarding/step/personal')
        .set('Authorization', `Bearer ${token}`)
        .send({ age: 28, gender: 'male', timezone: 'Europe/London' })
        .expect(200);
    });

    it('POST /onboarding/step/smoking — saves smoking habits', async () => {
      await request(app.getHttpServer())
        .post('/onboarding/step/smoking')
        .set('Authorization', `Bearer ${token}`)
        .send({ cigarettesPerDay: 12, yearsSmoking: 5, packCost: 15.50 })
        .expect(200);
    });

    it('POST /onboarding/step/quit-goal — saves quit goal', async () => {
      await request(app.getHttpServer())
        .post('/onboarding/step/quit-goal')
        .set('Authorization', `Bearer ${token}`)
        .send({ quitGoal: 'QUIT_NOW', quitDate: '2026-06-01T00:00:00.000Z' })
        .expect(200);
    });

    it('POST /onboarding/step/motivation — completes onboarding and seeds quit plan', async () => {
      const res = await request(app.getHttpServer())
        .post('/onboarding/step/motivation')
        .set('Authorization', `Bearer ${token}`)
        .send({ bio: 'I want to run a marathon.' })
        .expect(200);

      expect(res.body.message).toBe('Onboarding complete');
    });

    it('GET /onboarding/progress — all steps complete', async () => {
      const res = await request(app.getHttpServer())
        .get('/onboarding/progress')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.isOnboarded).toBe(true);
      expect(res.body.completionPercent).toBe(100);
      expect(res.body.nextStep).toBeNull();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Profiles', () => {
    it('GET /profiles/me — returns profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/profiles/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('cigarettesPerDay');
      expect(res.body.age).toBe(28);
    });

    it('PUT /profiles/update — updates profile', async () => {
      const res = await request(app.getHttpServer())
        .put('/profiles/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ cigarettesPerPack: 20, packCost: 15.50 })
        .expect(200);

      expect(Number(res.body.packCost)).toBe(15.50);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TRIGGERS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Triggers', () => {
    it('POST /triggers — creates a trigger', async () => {
      const res = await request(app.getHttpServer())
        .post('/triggers')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Stress' })
        .expect(201);

      expect(res.body.name).toBe('Stress');
      triggerId = res.body.id;
    });

    it('POST /triggers — rejects duplicate name', async () => {
      await request(app.getHttpServer())
        .post('/triggers')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Stress' })
        .expect(409);
    });

    it('GET /triggers — lists all triggers', async () => {
      const res = await request(app.getHttpServer())
        .get('/triggers')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /triggers/me — adds trigger to user list', async () => {
      await request(app.getHttpServer())
        .post('/triggers/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ triggerId })
        .expect(201);
    });

    it('POST /triggers/me — rejects duplicate user trigger', async () => {
      await request(app.getHttpServer())
        .post('/triggers/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ triggerId })
        .expect(409);
    });

    it('GET /triggers/me — returns user triggers', async () => {
      const res = await request(app.getHttpServer())
        .get('/triggers/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].id).toBe(triggerId);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SMOKING LOGS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Smoking Logs', () => {
    it('POST /smoking-logs — creates a log', async () => {
      const res = await request(app.getHttpServer())
        .post('/smoking-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity:  3,
          loggedAt:  new Date().toISOString(),
          mood:      'stressed',
          triggerId,
          note:      'after a meeting',
        })
        .expect(201);

      expect(res.body.quantity).toBe(3);
      expect(res.body.trigger.name).toBe('Stress');
      smokingLogId = res.body.id;
    });

    it('POST /smoking-logs — rejects invalid quantity', async () => {
      await request(app.getHttpServer())
        .post('/smoking-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 0, loggedAt: new Date().toISOString() })
        .expect(400);
    });

    it('GET /smoking-logs — returns paginated logs', async () => {
      const res = await request(app.getHttpServer())
        .get('/smoking-logs?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta).toHaveProperty('total');
    });

    it('GET /smoking-logs/summary/daily — returns daily summary', async () => {
      const res = await request(app.getHttpServer())
        .get('/smoking-logs/summary/daily')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /smoking-logs/summary/weekly — returns weekly summary', async () => {
      const res = await request(app.getHttpServer())
        .get('/smoking-logs/summary/weekly')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /smoking-logs/:id — returns single log', async () => {
      const res = await request(app.getHttpServer())
        .get(`/smoking-logs/${smokingLogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(smokingLogId);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CRAVINGS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Cravings', () => {
    it('POST /cravings — creates a craving log', async () => {
      const res = await request(app.getHttpServer())
        .post('/cravings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          intensity: 7,
          outcome:   'RESISTED',
          loggedAt:  new Date().toISOString(),
          mood:      'anxious',
          triggerId,
          note:      'took a walk',
        })
        .expect(201);

      expect(res.body.outcome).toBe('RESISTED');
      expect(res.body.intensity).toBe(7);
      cravingLogId = res.body.id;
    });

    it('POST /cravings — rejects invalid outcome', async () => {
      await request(app.getHttpServer())
        .post('/cravings')
        .set('Authorization', `Bearer ${token}`)
        .send({ intensity: 5, outcome: 'INVALID', loggedAt: new Date().toISOString() })
        .expect(400);
    });

    it('POST /cravings — rejects intensity out of range', async () => {
      await request(app.getHttpServer())
        .post('/cravings')
        .set('Authorization', `Bearer ${token}`)
        .send({ intensity: 11, outcome: 'RESISTED', loggedAt: new Date().toISOString() })
        .expect(400);
    });

    it('GET /cravings — returns paginated logs', async () => {
      const res = await request(app.getHttpServer())
        .get('/cravings?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /cravings/summary/outcomes — returns outcome summary', async () => {
      const res = await request(app.getHttpServer())
        .get('/cravings/summary/outcomes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('resistRate');
      expect(res.body.RESISTED).toBeGreaterThan(0);
    });

    it('GET /cravings/summary/daily — returns daily summary', async () => {
      const res = await request(app.getHttpServer())
        .get('/cravings/summary/daily')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIT PLANS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Quit Plans', () => {
    it('GET /quit-plans/active — returns seeded plan from onboarding', async () => {
      const res = await request(app.getHttpServer())
        .get('/quit-plans/active')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.active).toBe(true);
      quitPlanId = res.body.id;
    });

    it('GET /quit-plans — returns all plans', async () => {
      const res = await request(app.getHttpServer())
        .get('/quit-plans')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /quit-plans — creates GRADUAL plan with steps', async () => {
      const res = await request(app.getHttpServer())
        .post('/quit-plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type:      'GRADUAL',
          startDate: new Date().toISOString(),
          quitDate:  '2026-06-01T00:00:00.000Z',
        })
        .expect(201);

      expect(res.body.type).toBe('GRADUAL');
      expect(res.body.steps.length).toBe(4);
      quitPlanId      = res.body.id;
      quitPlanStepId  = res.body.steps[0].id;
    });

    it('PATCH /quit-plans/steps/:stepId — updates step target', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/quit-plans/steps/${quitPlanStepId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ targetCigarettesPerDay: 3 })
        .expect(200);

      expect(res.body.targetCigarettesPerDay).toBe(3);
    });

    it('PATCH /quit-plans/deactivate — deactivates plan', async () => {
      await request(app.getHttpServer())
        .patch('/quit-plans/deactivate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('GET /quit-plans/active — 404 when no active plan', async () => {
      await request(app.getHttpServer())
        .get('/quit-plans/active')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // RELAPSE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Relapse', () => {
    it('POST /relapses — logs a relapse and creates recovery notification', async () => {
      const res = await request(app.getHttpServer())
        .post('/relapses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cigarettes: 3,
          occurredAt: new Date().toISOString(),
          triggerId,
          note:       'rough day',
        })
        .expect(201);

      expect(res.body.cigarettes).toBe(3);
      expect(res.body.trigger.name).toBe('Stress');
      relapseId = res.body.id;

      // Verify notification was created
      const notifs = await prisma.notification.findMany({
        where: { userId, type: 'RELAPSE_RECOVERY' },
      });
      expect(notifs.length).toBeGreaterThan(0);
    });

    it('POST /relapses — rejects zero cigarettes', async () => {
      await request(app.getHttpServer())
        .post('/relapses')
        .set('Authorization', `Bearer ${token}`)
        .send({ cigarettes: 0, occurredAt: new Date().toISOString() })
        .expect(400);
    });

    it('GET /relapses — returns all relapses', async () => {
      const res = await request(app.getHttpServer())
        .get('/relapses')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.total).toBeGreaterThan(0);
    });

    it('GET /relapses/summary — returns summary with trigger', async () => {
      const res = await request(app.getHttpServer())
        .get('/relapses/summary')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('daysSinceRelapse');
      expect(res.body.mostCommonTrigger.name).toBe('Stress');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Progress', () => {
    it('GET /progress/dashboard — returns dashboard data', async () => {
      const res = await request(app.getHttpServer())
        .get('/progress/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('currentStreakHours');
      expect(res.body.data).toHaveProperty('moneySavedTotal');
      expect(res.body.data).toHaveProperty('nextMilestone');
      expect(res.body.data).toHaveProperty('todayTarget');
    });

    it('GET /progress/streak — returns streak details', async () => {
      const res = await request(app.getHttpServer())
        .get('/progress/streak')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('currentStreakDays');
      expect(res.body).toHaveProperty('longestStreakDays');
    });

    it('GET /progress/money-saved — returns savings breakdown', async () => {
      const res = await request(app.getHttpServer())
        .get('/progress/money-saved')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.saved).toHaveProperty('today');
      expect(res.body.saved).toHaveProperty('total');
      expect(res.body).toHaveProperty('costPerCigarette');
    });

    it('GET /progress/health-timeline — returns milestones', async () => {
      const res = await request(app.getHttpServer())
        .get('/progress/health-timeline')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.milestones.length).toBeGreaterThan(0);
      expect(res.body.milestones[0]).toHaveProperty('progressPercent');
    });

    it('GET /progress/weekly-summary — returns weekly comparison', async () => {
      const res = await request(app.getHttpServer())
        .get('/progress/weekly-summary')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('smoking');
      expect(res.body).toHaveProperty('cravings');
      expect(res.body).toHaveProperty('dailyBreakdown');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Notifications', () => {
    it('GET /notifications — returns notifications with unreadCount', async () => {
      const res = await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('unreadCount');
      expect(res.body.data.length).toBeGreaterThan(0);
      notificationId = res.body.data[0].id;
    });

    it('GET /notifications/preferences — returns preferences', async () => {
      const res = await request(app.getHttpServer())
        .get('/notifications/preferences')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('morningReminder');
      expect(res.body).toHaveProperty('missedLogReminders');
    });

    it('PATCH /notifications/preferences — updates preferences', async () => {
      const res = await request(app.getHttpServer())
        .patch('/notifications/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ morningReminder: false })
        .expect(200);

      expect(res.body.morningReminder).toBe(false);
    });

    it('PATCH /notifications/:id/read — marks notification as read', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.read).toBe(true);
    });

    it('PATCH /notifications/read-all — marks all as read', async () => {
      const res = await request(app.getHttpServer())
        .patch('/notifications/read-all')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.message).toBe('All notifications marked as read');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SUPPORT CONTACTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Support Contacts', () => {
    it('POST /support-contacts — creates a contact', async () => {
      const res = await request(app.getHttpServer())
        .post('/support-contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name:         'Sarah Whyte',
          phone:        '+447911123456',
          email:        'sarah@example.com',
          relationship: 'Sister',
        })
        .expect(201);

      expect(res.body.name).toBe('Sarah Whyte');
      supportContactId = res.body.id;
    });

    it('GET /support-contacts — lists contacts', async () => {
      const res = await request(app.getHttpServer())
        .get('/support-contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.total).toBeGreaterThan(0);
    });

    it('PATCH /support-contacts/:id — updates contact', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/support-contacts/${supportContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '+447922999888' })
        .expect(200);

      expect(res.body.phone).toBe('+447922999888');
    });

    it('DELETE /support-contacts/:id — removes contact', async () => {
      await request(app.getHttpServer())
        .delete(`/support-contacts/${supportContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Insights', () => {
    it('GET /insights/triggers — returns trigger insights with success rate', async () => {
      const res = await request(app.getHttpServer())
        .get('/insights/triggers')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('topTrigger');
      expect(res.body).toHaveProperty('hardest');
      expect(res.body.triggers[0]).toHaveProperty('successRate');
    });

    it('GET /insights/mood — returns mood breakdown', async () => {
      const res = await request(app.getHttpServer())
        .get('/insights/mood')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('whenSmoking');
      expect(res.body).toHaveProperty('whenCraving');
      expect(res.body).toHaveProperty('whenResisted');
    });

    it('GET /insights/peak-hours — returns bucketed time of day', async () => {
      const res = await request(app.getHttpServer())
        .get('/insights/peak-hours')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('hardestTimeOfDay');
      expect(res.body.buckets.length).toBe(5);
    });

    it('GET /insights/craving-vs-smoking — returns willpower ratio', async () => {
      const res = await request(app.getHttpServer())
        .get('/insights/craving-vs-smoking')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('willpowerRate');
      expect(res.body).toHaveProperty('verdict');
    });

    it('GET /insights/reduction — returns trend vs baseline', async () => {
      const res = await request(app.getHttpServer())
        .get('/insights/reduction')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('weeklyBaseline');
      expect(res.body).toHaveProperty('overallReductionPercent');
      expect(res.body.trend.length).toBe(6);
    });

    it('GET /insights/summary — returns all insights in one call', async () => {
      const res = await request(app.getHttpServer())
        .get('/insights/summary')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('triggers');
      expect(res.body).toHaveProperty('mood');
      expect(res.body).toHaveProperty('peakHours');
      expect(res.body).toHaveProperty('cravingVsSmoking');
      expect(res.body).toHaveProperty('reduction');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEANUP — Delete log and relapse records
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Cleanup', () => {
    it('DELETE /smoking-logs/:id — removes log', async () => {
      await request(app.getHttpServer())
        .delete(`/smoking-logs/${smokingLogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('DELETE /cravings/:id — removes craving', async () => {
      await request(app.getHttpServer())
        .delete(`/cravings/${cravingLogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('DELETE /relapses/:id — removes relapse', async () => {
      await request(app.getHttpServer())
        .delete(`/relapses/${relapseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('DELETE /triggers/me/:triggerId — removes user trigger', async () => {
      await request(app.getHttpServer())
        .delete(`/triggers/me/${triggerId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });
});