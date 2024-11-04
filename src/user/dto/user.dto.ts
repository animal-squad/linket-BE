import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({ description: 'Email address' })
    email: string

    @ApiProperty({ description: 'Nickname of user' })
    name: string

    @ApiProperty({ description: 'URL of user profile image' })
    photo: string
}
