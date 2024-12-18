import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import config from './config/config'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from '../prisma/prisma.module'
import { BucketModule } from './bucket/bucket.module'
import { LinkModule } from './link/link.module'
import { ExtensionModule } from './extension/extension.module'
import { SentryModule } from '@sentry/nestjs/setup'
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionFilter } from './sentry.filter'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
        }),
        SentryModule.forRoot(),
        PassportModule.register({ session: true }),
        AuthModule,
        UserModule,
        PrismaModule,
        BucketModule,
        LinkModule,
        ExtensionModule,
    ],
    controllers: [AppController],
    providers: [{ provide: APP_FILTER, useClass: AllExceptionFilter }, AppService],
})
export class AppModule {}
