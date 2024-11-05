import { ApiProperty } from '@nestjs/swagger'

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
