import { ConfigModule, ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { INestApplication } from '@nestjs/common'
import * as session from 'express-session'
import RedisStore from 'connect-redis'

export function setUpSession(app: INestApplication): void {
    const configService = app.get<ConfigService>(ConfigService)
    // TODO: Redis 연결
    // const port = configService.get('REDIS_PORT')
    // const host = configService.get('REDIS_HOST')
    //
    // const client = new Redis({
    //     host,
    //     port,
    // });

    // const redisStore = new RedisStore()

    app.use(
        session({
            // 세션 정보 설정
            secret: configService.get('SESSION_SECRET'),
            saveUninitialized: false,
            // store: redisStore,
            resave: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 600000,
            },
        }),
    )
}
