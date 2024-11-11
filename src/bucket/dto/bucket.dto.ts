import { ApiProperty } from '@nestjs/swagger'
import { LinkDto } from '../../link/dto/link.dto'

export class CreateBucketDto {
    @ApiProperty({ description: 'Title of the bucket' })
    title: string

    @ApiProperty({ description: 'Links of the bucket' })
    links: InputLinkDto[]

    @ApiProperty({ description: 'User email' })
    email: string
}

export class InputLinkDto {
    @ApiProperty({ description: 'Link URL' })
    URL: string

    @ApiProperty({ description: 'Link content' })
    content?: string
}

export class BucketDto {
    @ApiProperty({ description: 'User id' })
    userId: number

    @ApiProperty({ description: 'Title of bucket' })
    title: string

    @ApiProperty({ description: 'Counts of link' })
    linkCount: number

    @ApiProperty({ description: 'Created date of bucket' })
    createdAt: Date

    @ApiProperty({ description: 'Share permission of bucket' })
    isShared: boolean

    @ApiProperty({ description: 'Links of bucket' })
    links: LinkDto[]
}
