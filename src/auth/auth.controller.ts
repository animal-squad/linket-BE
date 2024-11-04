import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GoogleAuthGuard } from './auth.guard'

interface User {
    // User entity
    userId: string
    email: string
    name: string
    photo: string
}

@Controller('api/auth')
export class AuthController {
    @Get('google') // google login 시도시
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // 로그인 페이지로 리다이렉트
    }

    @Get('google/callback') // google login 후 세션 저장
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        req.session.save(() => {
            res.redirect(`${process.env.URL}/main/storage`) // 테스트용 임시 코드
        })
    }

    @Get('logout')
    // @UseGuards(GoogleAuthGuard)
    async logout(@Req() req: Request, @Res() res: Response) {
        await new Promise<void>(() => {
            req.session.destroy(() => {})
            res.clearCookie('connect.sid', { path: '/' })
            res.redirect(`${process.env.URL}`) // 테스트용 임시 코드
        })
    }
}
