// redis.provider.ts
import { Provider } from '@nestjs/common'
import { Redis } from 'ioredis'
import { ConfigService } from '@nestjs/config'

export const RedisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    useFactory: (configService: ConfigService) => {
        const client = new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        })

        client.on('error', err => console.error('Redis Client Error:', err))
        client.on('connect', () => console.log('Redis Connected'))

        return client
    },
    inject: [ConfigService],
}
