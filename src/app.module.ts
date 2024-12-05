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

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
        }),
        PassportModule.register({ session: true }),
        AuthModule,
        UserModule,
        PrismaModule,
        BucketModule,
        LinkModule,
        ExtensionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
