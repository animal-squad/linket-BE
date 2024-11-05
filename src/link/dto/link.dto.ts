import { ApiProperty } from '@nestjs/swagger'

class LinkDto {
    @ApiProperty({ description: 'Link Id' })
    linkId: number

    @ApiProperty({ description: 'Link title' })
    title: string

    @ApiProperty({ description: 'tags' })
    tags: string[]
}

export class UpdateLinkDto {
    @ApiProperty({ description: 'User id' })
    userId: number

    @ApiProperty({ description: 'Links id with tags and title' })
    links: LinkDto[]
}
