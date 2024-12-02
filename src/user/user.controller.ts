import { Controller, Get, Req } from '@nestjs/common'
import { GetUser } from './user.decorator'
import { UserService } from './user.service'
import { ApiCookieAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NotLoginResponse } from './user.exception'
import { UserResponse } from './dto/user.dto'

@ApiTags('User API')
@ApiCookieAuth('connect.sid')
@ApiHeader({ name: 'Cookie', description: '세션 id가 저장된 쿠키', required: true })
@ApiResponse({ status: 401, description: '쿠키에 세션 정보 없음', type: NotLoginResponse })
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({
        summary: '유저 정보 조회 API',
        description: '쿠키에 있는 세션 id를 바탕으로 유저 id로 유저 정보 조회',
    })
    @ApiResponse({ status: 200, description: '유저 정보 조회 성공', type: UserResponse })
    @Get()
    async getUser(@Req() req: Request, @GetUser() userId: number) {
        return await this.userService.findById(userId)
    }

    @ApiOperation({
        summary: '로그인 여부 체크 API',
        description: '쿠키에 세션 관련 정보가 있는지 조회하여 로그인 여부 판별',
    })
    @ApiResponse({ status: 200, description: '로그인 중' })
    @Get('check')
    getLoginInfo(@GetUser() userId: number) {
        return
    }
}
