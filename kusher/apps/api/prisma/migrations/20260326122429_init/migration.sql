-- CreateEnum
CREATE TYPE "QuitGoal" AS ENUM ('QUIT_NOW', 'REDUCE_GRADUALLY');

-- CreateEnum
CREATE TYPE "QuitPlanType" AS ENUM ('COLD_TURKEY', 'GRADUAL');

-- CreateEnum
CREATE TYPE "CravingOutcome" AS ENUM ('RESISTED', 'SMOKED', 'UNRESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cigarettesPerDay" INTEGER NOT NULL,
    "yearsSmoking" INTEGER,
    "packCost" DECIMAL(10,2),
    "quitGoal" "QuitGoal" NOT NULL,
    "quitDate" TIMESTAMP(3),
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrigger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuitReason" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuitReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuitPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "QuitPlanType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "quitDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuitPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuitPlanStep" (
    "id" TEXT NOT NULL,
    "quitPlanId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "targetCigarettesPerDay" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuitPlanStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CravingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "mood" TEXT,
    "triggerId" TEXT,
    "outcome" "CravingOutcome" NOT NULL,
    "note" TEXT,
    "loggedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CravingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmokingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "mood" TEXT,
    "triggerId" TEXT,
    "note" TEXT,
    "loggedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmokingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "relationship" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "morningReminder" BOOLEAN NOT NULL DEFAULT true,
    "triggerWindowReminder" BOOLEAN NOT NULL DEFAULT true,
    "streakUpdates" BOOLEAN NOT NULL DEFAULT true,
    "milestoneAlerts" BOOLEAN NOT NULL DEFAULT true,
    "missedLogReminders" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_name_key" ON "Trigger"("name");

-- CreateIndex
CREATE INDEX "UserTrigger_userId_idx" ON "UserTrigger"("userId");

-- CreateIndex
CREATE INDEX "UserTrigger_triggerId_idx" ON "UserTrigger"("triggerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrigger_userId_triggerId_key" ON "UserTrigger"("userId", "triggerId");

-- CreateIndex
CREATE INDEX "QuitReason_userId_idx" ON "QuitReason"("userId");

-- CreateIndex
CREATE INDEX "QuitPlan_userId_idx" ON "QuitPlan"("userId");

-- CreateIndex
CREATE INDEX "QuitPlan_userId_active_idx" ON "QuitPlan"("userId", "active");

-- CreateIndex
CREATE INDEX "QuitPlanStep_quitPlanId_idx" ON "QuitPlanStep"("quitPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "QuitPlanStep_quitPlanId_weekNumber_key" ON "QuitPlanStep"("quitPlanId", "weekNumber");

-- CreateIndex
CREATE INDEX "CravingLog_userId_idx" ON "CravingLog"("userId");

-- CreateIndex
CREATE INDEX "CravingLog_triggerId_idx" ON "CravingLog"("triggerId");

-- CreateIndex
CREATE INDEX "CravingLog_loggedAt_idx" ON "CravingLog"("loggedAt");

-- CreateIndex
CREATE INDEX "CravingLog_userId_loggedAt_idx" ON "CravingLog"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "SmokingLog_userId_idx" ON "SmokingLog"("userId");

-- CreateIndex
CREATE INDEX "SmokingLog_triggerId_idx" ON "SmokingLog"("triggerId");

-- CreateIndex
CREATE INDEX "SmokingLog_loggedAt_idx" ON "SmokingLog"("loggedAt");

-- CreateIndex
CREATE INDEX "SmokingLog_userId_loggedAt_idx" ON "SmokingLog"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "SupportContact_userId_idx" ON "SupportContact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrigger" ADD CONSTRAINT "UserTrigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrigger" ADD CONSTRAINT "UserTrigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuitReason" ADD CONSTRAINT "QuitReason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuitPlan" ADD CONSTRAINT "QuitPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuitPlanStep" ADD CONSTRAINT "QuitPlanStep_quitPlanId_fkey" FOREIGN KEY ("quitPlanId") REFERENCES "QuitPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CravingLog" ADD CONSTRAINT "CravingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CravingLog" ADD CONSTRAINT "CravingLog_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokingLog" ADD CONSTRAINT "SmokingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokingLog" ADD CONSTRAINT "SmokingLog_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportContact" ADD CONSTRAINT "SupportContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
