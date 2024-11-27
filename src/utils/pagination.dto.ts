import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryDto {
    @Type(() => Number)
    @IsOptional()
    page?: number

    @Type(() => Number)
    @IsOptional()
    take?: number
}

export class PaginatedBucketDto<T> {
    @ApiProperty({
        description: '페이지에 표시될 바구니 목록',
        example: {
            bucketId: 'KnNNaU8U',
            userId: 1,
            title: '2024. 11. 9. 오후 4:05:48에 생성된 Bucket',
            linkCount: 3,
            createdAt: '2024-11-09T16:05:48.283Z',
            isShared: false,
        },
    })
    buckets: T[]

    @ApiProperty({
        description: 'meta data',
        example: {
            totalBuckets: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            page: 1,
            take: 10,
        },
    })
    meta: {
        totalBuckets: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
        page: number
        take: number
    }

    constructor(buckets: T[], page: number, take: number, totalBuckets: number) {
        this.buckets = buckets
        this.meta = {
            totalBuckets,
            totalPages: Math.ceil(totalBuckets / take),
            hasNextPage: page < Math.ceil(totalBuckets / take),
            hasPrevPage: page > 1,
            page,
            take,
        }
    }
}

export class PaginatedLinkDto<T> {
    links: T[]
    meta: {
        totalLinks: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
        page: number
        take: number
        tag: string[]
    }

    constructor(links: T[], page: number, take: number, tag: string[], totalLinks: number) {
        this.links = links
        this.meta = {
            totalLinks,
            totalPages: Math.ceil(totalLinks / take),
            hasNextPage: page < Math.ceil(totalLinks / take),
            hasPrevPage: page > 1,
            page,
            take,
            tag,
        }
    }
}
