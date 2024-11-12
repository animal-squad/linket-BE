import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        // DB에서 email 저장 여부를 확인하는 함수
        return this.prisma.user.findUnique({ where: { email } })
    }

    async create(user: CreateUserDto) {
        // DB에 유저 정보를 저장하는 함수
        return this.prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                photo: user.photo,
            },
        })
    }

    async findById(userId: number) {
        return this.prisma.user.findUnique({ where: { userId: userId } })
    }
}
