import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: `${configService.get('URL')}/api/auth/google/callback`,
            scope: ['email', 'profile'],
            proxy: true,
        })
    }

    authorizationParams(): { [key: string]: string } {
        // google api를 호출할 때 사용하는 refresh token 발급하는 함수
        return {
            access_type: 'offline',
            prompt: 'select_account',
        }
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
        const { name, emails, provider, photos } = profile
        const googleUserInfo = {
            // google login으로 받아오는 정보
            email: emails[0].value,
            name: name.givenName + ' ' + name.familyName,
            picture: photos[0].value,
            socialProvider: provider,
            accessToken,
            refreshToken,
        }
        try {
            const user = await this.authService.validateUser({
                // user 정보 저장 여부 확인
                email: googleUserInfo.email,
                name: googleUserInfo.name,
                photo: googleUserInfo.picture,
            })
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
}
