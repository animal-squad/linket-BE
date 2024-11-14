import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { INestApplication } from '@nestjs/common'
import * as session from 'express-session'
import { default as RedisStore } from 'connect-redis'

export async function setUpSession(app: INestApplication, redisClient: Redis): Promise<void> {
    const configService = app.get<ConfigService>(ConfigService)

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
                secure: true,
                maxAge: 600000,
                path: '/',
                sameSite: 'none',
                domain: configService.get('DOMAIN'),
            },
        }),
    )
}
