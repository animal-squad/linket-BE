import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'
import { NotLoginException } from './user.exception'

export const GetUser = createParamDecorator((data: any, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest()
    console.log(request.headers)
    return request.session.passport.user
})
