import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({ description: '이메일 주소', example: 'test@gmail.com' })
    email: string

    @ApiProperty({ description: '이름', example: 'test' })
    name: string

    @ApiProperty({ description: '프로필 사진 주소', example: 'testUrl' })
    photo: string
}

export class UserResponse {
    @ApiProperty({ description: '이메일 주소', example: 'test@gmail.com' })
    email: string

    @ApiProperty({ description: '이름', example: 'test' })
    name: string

    @ApiProperty({ description: '프로필 사진 주소', example: 'testUrl' })
    photo: string

    @ApiProperty({ description: 'User id', example: 1 })
    userId: number
}
