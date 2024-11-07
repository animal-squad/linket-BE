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
    data: T[]
    meta: {
        totalBuckets: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
        page: number
        take: number
    }

    constructor(data: T[], page: number, take: number, totalBuckets: number) {
        this.data = data
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
