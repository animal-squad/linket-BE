import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'

interface User {      // User entity
    id: string
    email: string
    name: string
    photo: string
}

@Controller('auth')
export class AuthController {
    @Get('google')                     // google login 시도시
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('google/callback')            // google login 진행 후 callback
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req: Request, @Res() res: Response, @Session() session: any) {
        const user = req.user as User // 유저 정보 반환
        req.session['userId'] = user.email  // session 저장
        res.redirect('/')               // 메인으로 redirect
    }
}
