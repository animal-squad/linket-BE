import { ApiProperty } from '@nestjs/swagger'

export class CreateLinkDto {
    @ApiProperty({ description: 'Link URL' })
    URL: string
}
