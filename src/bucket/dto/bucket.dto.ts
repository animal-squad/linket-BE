import { ApiProperty } from '@nestjs/swagger'

export class CreateBucketDto {
    @ApiProperty({ description: 'Title of the bucket' })
    title: string

    @ApiProperty({ description: 'Links of the bucket' })
    links: string[]
}
