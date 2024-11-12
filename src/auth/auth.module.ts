import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './google.strategy'
import { UserModule } from '../user/user.module'
import { ConfigModule } from '@nestjs/config'
import { SessionSerializer } from './session.serializer'
import { RedisProvider } from '../session/redis.provider'

@Module({
    imports: [PassportModule.register({ session: true }), UserModule, ConfigModule],
    providers: [RedisProvider, AuthService, GoogleStrategy, SessionSerializer],
    controllers: [AuthController],
    exports: ['REDIS_CLIENT'],
})
export class AuthModule {}
