# 🚬 Unburnt

> *Real-time craving support, personalized quit plans, and relapse recovery — built for smokers who are serious about quitting.*

---

## What is Unburnt?

Unburnt is a mobile application designed to help smokers reduce, abstain, and ultimately quit — on their own terms. It doesn't lecture. It doesn't guilt-trip. It meets you where you are and gives you the tools to move forward.

Whether you're cutting down gradually, going cold turkey, or recovering from a relapse, Unburnt tracks your journey, surfaces patterns you can't see on your own, and supports you in the moments that matter most — when a craving hits.

---

## Core Features

**Craving Support**
Log cravings in real time, track intensity and mood, and record whether you resisted, smoked, or left it unresolved. Over time, patterns emerge — and patterns can be broken.

**Personalized Quit Plans**
Onboarding builds a quit plan around your smoking history, daily cigarette count, and quit goal. Cold turkey or gradual reduction — the plan adapts to you, with weekly targets that step you down at a pace you can sustain.

**Trigger Tracking**
Identify and monitor your personal triggers — stress, boredom, alcohol, social settings. Understanding what drives a craving is the first step to defusing it.

**Smoking Logs**
Track every cigarette with mood, trigger, and timestamp. Daily and weekly summaries show exactly how your consumption is trending.

**Progress Analytics**
Visual insights into your resist rate, craving frequency, cigarette reduction over time, and streak data. Progress is motivating — even when it's not perfect.

**Relapse Recovery**
A relapse isn't the end. Unburnt treats it as data, not failure. Log it, understand it, and get back on track without starting from scratch.

**Health Timeline**
As time smoke-free accumulates, your body recovers in measurable ways. The health timeline surfaces these milestones — from blood pressure normalizing at 20 minutes to cancer risk halving at 5 years.

**Support Contacts**
Add trusted people to your support network. When a craving is intense, reaching out should take one tap.

**Notification System**
Configurable reminders — morning check-ins, streak updates, milestone alerts, and missed log nudges — keep you engaged without being overwhelming.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native |
| API | NestJS (Node.js) |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (access tokens) |
| Validation | class-validator + class-transformer |

---

## API Modules

| Module | Description |
|--------|-------------|
| `auth` | Register, login, JWT issuance |
| `users` | User account management |
| `profiles` | Smoking profile — habits, goals, demographics |
| `onboarding` | Multi-step onboarding flow, quit plan seeding |
| `smoking-logs` | Cigarette logging with daily/weekly aggregates |
| `cravings` | Craving logs with outcome tracking and resist rate |
| `triggers` | Global trigger library + user trigger selection |
| `quit-plans` | Active plan management and weekly step tracking |
| `relapse` | Relapse logging and recovery flow |
| `progress` | Streak, reduction trends, milestone detection |
| `insights` | Aggregated behavioral analytics |
| `notifications` | Notification preferences and delivery |
| `support-contacts` | Emergency contact management |
| `health-timeline` | Time-based health recovery milestones |

---

## Data Privacy

Every data point in Unburnt — logs, cravings, triggers, contacts — is scoped strictly to the authenticated user. No data is shared, sold, or used for advertising. Your quit journey is yours.

---

## Status

🟡 **In active development** — core modules shipping iteratively.

| Module | Status |
|--------|--------|
| Auth | ✅ Complete |
| Users | ✅ Complete |
| Profiles | ✅ Complete |
| Onboarding | ✅ Complete |
| Smoking Logs | ✅ Complete |
| Triggers | ✅ Complete |
| Cravings | ✅ Complete |
| Quit Plans | 🔄 In progress |
| Relapse | 🔲 Upcoming |
| Progress | 🔲 Upcoming |
| Insights | 🔲 Upcoming |
| Notifications | 🔲 Upcoming |
| Support Contacts | 🔲 Upcoming |
| Health Timeline | 🔲 Upcoming |

---

*Built with the belief that quitting is hard enough — the tools shouldn't be.*
