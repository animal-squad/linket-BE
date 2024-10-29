import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    async canActivate(context: any): Promise<boolean> {
        console.log('start activate function')
        const result = (await super.canActivate(context)) as boolean
        const request = context.switchToHttp().getRequest()
        console.log('start login')
        await super.logIn(request)
        return result
    }
}
