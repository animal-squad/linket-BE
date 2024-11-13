import { PassportSerializer } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Redis } from 'ioredis'
import { User } from '@prisma/client'

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        private readonly userService: UserService,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) {
        super()
    }

    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        console.log('serializeUser의 값', user)
        done(null, user.userId)
    }

    async deserializeUser(userId: number, done: (err: Error, payload: any) => void) {
        console.log('excute deserializer')
        try {
            const cachedUser = await this.redisClient.get(`userId:${userId}`)
            console.log(cachedUser)
            if (cachedUser) {
                done(null, JSON.parse(cachedUser))
                return
            }

            const user = await this.userService.findById(userId)

            await this.redisClient.setex(`userId:${userId}`, 3600, JSON.stringify(user.userId))
            done(null, user.userId)
        } catch (error) {
            console.log(error)
            done(error, null)
        }
    }
}
