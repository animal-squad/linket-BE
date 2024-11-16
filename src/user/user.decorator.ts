import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'
import { NotLoginException } from './user.exception'

export const GetUser = createParamDecorator((data: any, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest()
    const userId = request.session?.passport?.user
    if (!userId) throw new NotLoginException()
    return userId
})
