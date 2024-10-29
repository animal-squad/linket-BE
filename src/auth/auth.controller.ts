import { Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GoogleAuthGuard } from './auth.guard'

interface User {
    // User entity
    id: string
    email: string
    name: string
    photo: string
}

@Controller('auth')
export class AuthController {
    @Get('google') // google login 시도시
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // 로그인 페이지로 리다이렉트
    }

    @Get('google/callback') // google login 후 세션 저장
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const user = req.user as User // 유저 정보 반환
        req.session['userId'] = user.email // session에 userId 넣기
        req.session.save(() => {
            res.redirect('http://localhost:5173/main/storage') // 메인으로 redirect
        })
    }

    @Get('logout')
    // @UseGuards(GoogleAuthGuard)
    async logout(@Req() req: Request, @Res() res: Response) {
        await new Promise<void>(() => {
            req.session.destroy(() => {})
            res.clearCookie('connect.sid', { path: '/' })
            res.redirect('http://localhost:5173/')
        })
    }
}
