import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { GoogleAuthGuard } from './auth.guard'
import { Redis } from 'ioredis'
import { GetUser } from '../user/user.decorator'
import { ApiCookieAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Google OAuth API')
@Controller('api/auth')
export class AuthController {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    @ApiOperation({ summary: '구글 로그인 API', description: '구글 OAuth 로그인 요청' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 401 })
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {}

    @ApiOperation({ summary: '구글 로그인 콜백', description: '구글 로그인 콜백 처리 및 로그인 성공 시 세션 저장해서 쿠키에 id 저장' })
    @ApiResponse({ status: 200, headers: { 'Set-Cookie': { description: '쿠키에 세션 id 저장', schema: { type: 'string' } } } })
    @ApiResponse({ status: 401 })
    @Get('google/callback') // google login 후 세션 저장
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        return req.session.save(() => {
            res.redirect(`${process.env.URL}/bucket`)
        })
    }

    @ApiOperation({ summary: '로그아웃 API', description: '로그아웃을 진행하며 쿠키와 세션 삭제' })
    @ApiCookieAuth('connect.sid')
    @ApiHeader({ name: 'Cookie', description: '세션 id가 저장된 쿠키', required: true })
    @ApiResponse({ status: 200, description: '로그아웃 성공 후 메인 페이지로 리다이렉트' })
    @ApiResponse({ status: 401, description: '쿠키에 세션 id가 없는 경우 정상적인 로그아웃 실패' })
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
