import { ApiProperty } from '@nestjs/swagger'

class InputLinkDto {
    @ApiProperty({ description: 'Link Id' })
    linkId: number

    @ApiProperty({ description: 'Link title' })
    title?: string

    @ApiProperty({ description: 'tags' })
    tags: string[]
}

export class UpdateLinkDto {
    @ApiProperty({ description: 'Links id with tags and title' })
    links: InputLinkDto[]
}

export class CreateLinkDto {
    @ApiProperty({ description: 'Link URL' })
    URL: string

    @ApiProperty({ description: 'Title of link' })
    title?: string

    @ApiProperty({ description: 'Tags of link' })
    tags?: string[]
}

export class LinkDto {
    @ApiProperty({ description: 'Link id' })
    linkId: number

    @ApiProperty({ description: 'Link title' })
    title?: string

    @ApiProperty({ description: 'Tags of link' })
    tags?: string[]

    @ApiProperty({ description: 'Created date of link' })
    createdAt: Date

    @ApiProperty({ description: 'Opened date of link' })
    openedAt: Date

    @ApiProperty({ description: 'User id' })
    userId: number

    @ApiProperty({ description: 'Link URL' })
    URL: string

    @ApiProperty({ description: 'Views of link' })
    views: number
}