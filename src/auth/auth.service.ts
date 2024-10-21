import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(userInfo: { email: string; name: string; photo: string }): Promise<any> {    // login 시도시 유저 정보가 있는지 확인하는 함수
        const { email, name, photo } = userInfo
        let user = await this.userService.findByEmail(email)         // 유저 등록 여부 확인
        if (!user) {
            user = await this.userService.create({ email, name, photo })   // 미등록시 유저 정보 DB에 저장
        }
        return user
    }
}
