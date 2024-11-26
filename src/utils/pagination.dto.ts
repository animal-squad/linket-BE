import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class PaginationQueryDto {
    @Type(() => Number)
    @IsOptional()
    page?: number

    @Type(() => Number)
    @IsOptional()
    take?: number
}

export class PaginatedBucketDto<T> {
    buckets: T[]
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
