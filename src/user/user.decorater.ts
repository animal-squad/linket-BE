import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'
import { NotLoginException } from './user.exception'

export const GetUser = createParamDecorator((data: any, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest()
    if (!request.user) {
        throw new NotLoginException()
    }
    return request.user
})
