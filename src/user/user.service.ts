import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        // DB에서 email 저장 여부를 확인하는 함수
        return this.userRepository.findOne({ where: { email } })
    }

    async create(user: Partial<User>): Promise<User> {
        // DB에 유저 정보를 저장하는 함수
        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }
}
