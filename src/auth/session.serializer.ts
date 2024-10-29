import { PassportSerializer } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Redis } from 'ioredis'

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        private readonly userService: UserService,
        // @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) {
        super()
    }

    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        console.log('run serializer')
        done(null, user)
        console.log(user)
    }

    async deserializeUser(email: string, done: (err: Error, payload: any) => void) {
        const user = await this.userService.findByEmail(email)
        done(null, user)
    }
}
