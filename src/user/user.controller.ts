import { Controller, Get, Req } from '@nestjs/common'
import { GetUser } from './user.decorator'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    async getUser(@Req() req: Request, @GetUser() userId: number) {
        return await this.userService.findById(userId)
    }

    @Get('check')
    getLoginInfo(@GetUser() userId: number) {
        return
    }
}
