import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GoogleAuthGuard } from './auth.guard'
import { Redis } from 'ioredis'
import { GetUser } from '../user/user.decorator'

@Controller('api/auth')
export class AuthController {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    @Get('google') // google login 시도시
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {}

    @Get('google/callback') // google login 후 세션 저장
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        return req.session.save(() => {
            res.redirect(`${process.env.URL}/main/bucket`)
        })
    }

    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response, @GetUser() userId: number) {
        await new Promise<void>(() => {
            req.session.destroy(() => {})
            res.clearCookie('connect.sid', { path: '/' })
            this.redisClient.del(`user:${userId}`)
            res.redirect(`${process.env.URL}`)
        })
    }
}
