#!/bin/bash

echo "Starting backend platform setup..."

# 1. Update system
echo "Updating system..."
sudo apt update -y

# 2. Install Node if not installed
if ! command -v node &> /dev/null
then
    echo "Installing NodeJS..."
    sudo apt install -y nodejs npm
fi

# 3. Install NestJS CLI
echo "Installing NestJS CLI..."
npm install -g @nestjs/cli

# 4. Create NestJS project
echo "Creating NestJS project..."
nest new quit-smoking-backend -p npm

cd quit-smoking-backend

# 5. Install Prisma + PostgreSQL tools
echo "Installing Prisma and dependencies..."
npm install prisma @prisma/client
npm install class-validator class-transformer
npm install @nestjs/config @nestjs/swagger swagger-ui-express
npm install passport passport-jwt @nestjs/passport @nestjs/jwt
npm install bcrypt
npm install --save-dev @types/bcrypt

# 6. Initialize Prisma
echo "Initializing Prisma..."
npx prisma init

# 7. Create folder structure
echo "Creating module directories..."

mkdir -p src/auth/dto
mkdir -p src/users/dto
mkdir -p src/profiles/dto
mkdir -p src/triggers/dto
mkdir -p src/quit-plans/dto
mkdir -p src/cravings/dto
mkdir -p src/smoking-logs/dto
mkdir -p src/progress
mkdir -p src/insights
mkdir -p src/relapse/dto
mkdir -p src/notifications/dto
mkdir -p src/common/guards
mkdir -p src/common/interceptors
mkdir -p src/common/filters
mkdir -p src/common/decorators
mkdir -p src/database/prisma

# 8. Generate NestJS modules
echo "Generating NestJS modules..."

nest g module auth
nest g controller auth
nest g service auth

nest g module users
nest g controller users
nest g service users

nest g module profiles
nest g controller profiles
nest g service profiles

nest g module triggers
nest g controller triggers
nest g service triggers

nest g module quit-plans
nest g controller quit-plans
nest g service quit-plans

nest g module cravings
nest g controller cravings
nest g service cravings

nest g module smoking-logs
nest g controller smoking-logs
nest g service smoking-logs

nest g module progress
nest g controller progress
nest g service progress

nest g module insights
nest g controller insights
nest g service insights

nest g module relapse
nest g controller relapse
nest g service relapse

nest g module notifications
nest g controller notifications
nest g service notifications

# 9. Create Prisma service
echo "Creating Prisma service..."

cat <<EOL > src/database/prisma/prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.\$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.\$on('beforeExit', async () => {
      await app.close();
    });
  }
}
EOL

# 10. Create Prisma module
cat <<EOL > src/database/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOL

echo "Backend platform setup complete!"
echo "Run: npm run start:dev"