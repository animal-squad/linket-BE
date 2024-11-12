import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { GetUser } from './user.decorater'
import { User } from '@prisma/client'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    async getUser(@Req() req: Request, @GetUser() userId: number) {
        const user = await this.userService.findById(userId)
        console.log(user)
        return user
    }
}
