import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GoogleAuthGuard } from './auth.guard'
import { Redis } from 'ioredis'
import { User } from '@prisma/client'

@Controller('api/auth')
export class AuthController {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    @Get('google') // google login 시도시
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // 로그인 페이지로 리다이렉트
    }

    @Get('google/callback') // google login 후 세션 저장
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        console.log('callback cookie', req.headers.cookie)
        return req.session.save(() => {

            res.redirect(`${process.env.URL}/main/bucket`)
        })
    }

    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        await new Promise<void>(() => {
            const user = req.user as User
            const userId = user.userId
            req.session.destroy(() => {})
            res.clearCookie('connect.sid', { path: '/' })
            this.redisClient.del(`userId:${userId}`)
            res.redirect(`${process.env.URL}`)
        })
    }
}
