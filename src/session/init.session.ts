import { ConfigModule, ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { INestApplication } from '@nestjs/common'
import * as session from 'express-session'
import { default as RedisStore } from 'connect-redis'

export async function setUpSession(app: INestApplication): Promise<void> {
    const configService = app.get<ConfigService>(ConfigService)

    const redisClient = new Redis({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
    })

    redisClient.on('error', err => console.error('Redis Client Error:', err))
    redisClient.on('connect', () => console.log('Redis Connected'))

    // RedisStore 인스턴스 생성
    const redisStore = new (RedisStore as any)({
        client: redisClient,
        prefix: 'session:',
    })

    app.use(
        session({
            store: redisStore,
            secret: configService.get('SESSION_SECRET'),
            saveUninitialized: false,
            resave: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 600000,
                path: '/',
                sameSite: 'lax',
            },
        }),
    )
}
