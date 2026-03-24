#!/usr/bin/env bash

set -e

PROJECT_NAME="lastStick"

echo "Creating monorepo structure for ${PROJECT_NAME}..."

# Root folders
mkdir -p apps/mobile
mkdir -p apps/api
mkdir -p packages/ui/src
mkdir -p packages/types/src
mkdir -p packages/utils/src
mkdir -p packages/config
mkdir -p tooling/eslint
mkdir -p tooling/typescript

# -----------------------------
# MOBILE STRUCTURE
# -----------------------------
mkdir -p apps/mobile/app/'(auth)'
mkdir -p apps/mobile/app/'(onboarding)'
mkdir -p apps/mobile/app/'(tabs)'
mkdir -p apps/mobile/app/craving
mkdir -p apps/mobile/app/logs
mkdir -p apps/mobile/app/relapse

mkdir -p apps/mobile/src/components/common
mkdir -p apps/mobile/src/components/dashboard
mkdir -p apps/mobile/src/components/forms
mkdir -p apps/mobile/src/components/progress
mkdir -p apps/mobile/src/components/rescue
mkdir -p apps/mobile/src/hooks
mkdir -p apps/mobile/src/services/api
mkdir -p apps/mobile/src/services/analytics
mkdir -p apps/mobile/src/services/notifications
mkdir -p apps/mobile/src/services/feedback
mkdir -p apps/mobile/src/store
mkdir -p apps/mobile/src/lib
mkdir -p apps/mobile/src/constants
mkdir -p apps/mobile/src/utils
mkdir -p apps/mobile/src/types
mkdir -p apps/mobile/src/providers
mkdir -p apps/mobile/assets

touch apps/mobile/app/_layout.tsx
touch apps/mobile/app/index.tsx

touch apps/mobile/app/'(auth)'/login.tsx
touch apps/mobile/app/'(auth)'/register.tsx
touch apps/mobile/app/'(auth)'/forgot-password.tsx

touch apps/mobile/app/'(onboarding)'/welcome.tsx
touch apps/mobile/app/'(onboarding)'/smoking-habits.tsx
touch apps/mobile/app/'(onboarding)'/triggers.tsx
touch apps/mobile/app/'(onboarding)'/reasons.tsx
touch apps/mobile/app/'(onboarding)'/quit-plan.tsx
touch apps/mobile/app/'(onboarding)'/complete.tsx

touch apps/mobile/app/'(tabs)'/dashboard.tsx
touch apps/mobile/app/'(tabs)'/progress.tsx
touch apps/mobile/app/'(tabs)'/insights.tsx
touch apps/mobile/app/'(tabs)'/support.tsx
touch apps/mobile/app/'(tabs)'/settings.tsx

touch apps/mobile/app/craving/rescue.tsx
touch apps/mobile/app/craving/breathing.tsx
touch apps/mobile/app/craving/result.tsx

touch apps/mobile/app/logs/craving.tsx
touch apps/mobile/app/logs/smoking.tsx

touch apps/mobile/app/relapse/report.tsx
touch apps/mobile/app/relapse/restart.tsx

touch apps/mobile/src/components/common/.gitkeep
touch apps/mobile/src/components/dashboard/.gitkeep
touch apps/mobile/src/components/forms/.gitkeep
touch apps/mobile/src/components/progress/.gitkeep
touch apps/mobile/src/components/rescue/.gitkeep

touch apps/mobile/src/hooks/.gitkeep
touch apps/mobile/src/store/.gitkeep
touch apps/mobile/src/lib/.gitkeep
touch apps/mobile/src/constants/.gitkeep
touch apps/mobile/src/utils/.gitkeep
touch apps/mobile/src/types/.gitkeep
touch apps/mobile/src/providers/.gitkeep

touch apps/mobile/src/services/api/client.ts
touch apps/mobile/src/services/api/auth.ts
touch apps/mobile/src/services/api/profile.ts
touch apps/mobile/src/services/api/quitPlans.ts
touch apps/mobile/src/services/api/cravings.ts
touch apps/mobile/src/services/api/smokingLogs.ts
touch apps/mobile/src/services/api/progress.ts
touch apps/mobile/src/services/api/notifications.ts

touch apps/mobile/src/services/analytics/posthog.ts
touch apps/mobile/src/services/analytics/events.ts

touch apps/mobile/src/services/notifications/oneSignal.ts
touch apps/mobile/src/services/notifications/expoNotifications.ts

touch apps/mobile/src/services/feedback/instabug.ts
touch apps/mobile/src/services/feedback/prompts.ts

touch apps/mobile/app.json
touch apps/mobile/babel.config.js
touch apps/mobile/metro.config.js
touch apps/mobile/tailwind.config.js
touch apps/mobile/nativewind-env.d.ts
touch apps/mobile/package.json
touch apps/mobile/tsconfig.json

# -----------------------------
# API STRUCTURE
# -----------------------------
mkdir -p apps/api/prisma/migrations
mkdir -p apps/api/src/config
mkdir -p apps/api/src/common/decorators
mkdir -p apps/api/src/common/dto
mkdir -p apps/api/src/common/enums
mkdir -p apps/api/src/common/filters
mkdir -p apps/api/src/common/guards
mkdir -p apps/api/src/common/interceptors
mkdir -p apps/api/src/common/pipes
mkdir -p apps/api/src/common/utils

mkdir -p apps/api/src/infrastructure/prisma
mkdir -p apps/api/src/infrastructure/redis
mkdir -p apps/api/src/infrastructure/queue
mkdir -p apps/api/src/infrastructure/logger
mkdir -p apps/api/src/infrastructure/mail

mkdir -p apps/api/src/modules/auth/dto
mkdir -p apps/api/src/modules/auth/strategies
mkdir -p apps/api/src/modules/auth/guards

mkdir -p apps/api/src/modules/users
mkdir -p apps/api/src/modules/profiles
mkdir -p apps/api/src/modules/onboarding
mkdir -p apps/api/src/modules/triggers
mkdir -p apps/api/src/modules/quit-plans
mkdir -p apps/api/src/modules/cravings
mkdir -p apps/api/src/modules/smoking-logs
mkdir -p apps/api/src/modules/progress
mkdir -p apps/api/src/modules/insights
mkdir -p apps/api/src/modules/relapse
mkdir -p apps/api/src/modules/support-contacts
mkdir -p apps/api/src/modules/notifications
mkdir -p apps/api/src/modules/health-timeline
mkdir -p apps/api/src/docs

mkdir -p apps/api/test/unit
mkdir -p apps/api/test/e2e

touch apps/api/prisma/schema.prisma
touch apps/api/prisma/seed.ts

touch apps/api/src/main.ts
touch apps/api/src/app.module.ts

touch apps/api/src/config/env.schema.ts
touch apps/api/src/config/app.config.ts
touch apps/api/src/config/jwt.config.ts
touch apps/api/src/config/database.config.ts

touch apps/api/src/modules/auth/auth.controller.ts
touch apps/api/src/modules/auth/auth.service.ts
touch apps/api/src/modules/auth/auth.module.ts

touch apps/api/src/docs/swagger.ts

touch apps/api/package.json
touch apps/api/nest-cli.json
touch apps/api/tsconfig.json
touch apps/api/.env

# -----------------------------
# SHARED PACKAGES
# -----------------------------
touch packages/ui/src/index.ts

touch packages/types/src/auth.ts
touch packages/types/src/profile.ts
touch packages/types/src/quit-plan.ts
touch packages/types/src/craving.ts
touch packages/types/src/smoking-log.ts
touch packages/types/src/progress.ts
touch packages/types/src/index.ts
touch packages/types/package.json
touch packages/types/tsconfig.json

touch packages/utils/src/date.ts
touch packages/utils/src/money.ts
touch packages/utils/src/streak.ts
touch packages/utils/src/health.ts
touch packages/utils/src/index.ts
touch packages/utils/package.json
touch packages/utils/tsconfig.json

touch packages/config/package.json

# -----------------------------
# TOOLING FILES
# -----------------------------
touch tooling/eslint/.gitkeep
touch tooling/typescript/.gitkeep

# -----------------------------
# ROOT FILES
# -----------------------------
cat > package.json <<'EOF'
{
  "name": "laststick",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
EOF

cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
EOF

cat > turbo.json <<'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {},
    "typecheck": {}
  }
}
EOF

cat > .gitignore <<'EOF'
node_modules
.pnpm-store
dist
build
.expo
.next
coverage
.env
.env.local
.DS_Store
*.log
EOF

cat > .env.example <<'EOF'
DATABASE_URL=
REDIS_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_SENTRY_DSN=

POSTHOG_API_KEY=
SENTRY_AUTH_TOKEN=

ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=
EOF

cat > README.md <<'EOF'
# LastStick

Monorepo for the LastStick smoking cessation MVP.

## Apps
- mobile: React Native + Expo app
- api: NestJS backend API

## Packages
- ui
- types
- utils
- config

## Getting started
1. Run setup script
2. Install dependencies with pnpm
3. Scaffold Expo and NestJS internals
4. Start building MVP modules
EOF

echo "Project structure created successfully."