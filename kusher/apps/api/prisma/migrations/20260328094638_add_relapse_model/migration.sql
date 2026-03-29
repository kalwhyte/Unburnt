-- CreateTable
CREATE TABLE "Relapse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "triggerId" TEXT,
    "note" TEXT,
    "cigarettes" INTEGER NOT NULL DEFAULT 1,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relapse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Relapse_userId_idx" ON "Relapse"("userId");

-- CreateIndex
CREATE INDEX "Relapse_userId_occurredAt_idx" ON "Relapse"("userId", "occurredAt");

-- AddForeignKey
ALTER TABLE "Relapse" ADD CONSTRAINT "Relapse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relapse" ADD CONSTRAINT "Relapse_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
