import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './google.strategy'
import { UserModule } from '../user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SessionSerializer } from './session.serializer'

@Module({
    imports: [PassportModule.register({ session: true }), UserModule, ConfigModule],
    providers: [AuthService, GoogleStrategy, SessionSerializer],
    // //TODO: Redis 연결
    // providers: [AuthService, GoogleStrategy, SessionSerializer, {
    //     provide: 'REDIS_CLIENT',
    //     useFactory: (configService: ConfigService) => {
    //         const Redis = require('ioredis');
    //         return new Redis({
    //             host: configService.get('redis.host'),
    //             port: configService.get('redis.port'),
    //         });
    //     },
    //     inject: [ConfigService],
    // }],
    controllers: [AuthController],
})
export class AuthModule {}
