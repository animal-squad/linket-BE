import { Injectable } from '@nestjs/common'
import { CreateBucketDto } from './dto/bucket.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { LinkService } from '../link/link.service'
import { getTime } from '../utils/time.util'
import { PaginatedBucketDto, PaginationQueryDto } from '../utils/pagination.dto'
import { Bucket } from '@prisma/client'
import { BucketUnauthorizedUserException } from '../user/user.exception'

@Injectable()
export class BucketService {
    constructor(
        private prisma: PrismaService,
        private readonly linkService: LinkService,
    ) {}

    async create(createBucketDto: CreateBucketDto, userId: number) {
        const bucket = await this.prisma.bucket.create({
            data: {
                title: createBucketDto.title || new Date().toLocaleString('ko-KR') + '에 생성된 Bucket',
                userId: userId,
                linkCount: createBucketDto.links.length,
                createdAt: getTime(),
            },
        })
        return bucket.bucketId
    }

    async findAll(userId: number, query: PaginationQueryDto): Promise<PaginatedBucketDto<Bucket>> {
        const page = query.page ?? 1
        const take = query.take ?? 10

        const [buckets, totalBuckets] = await Promise.all([
            this.prisma.bucket.findMany({
                skip: (page - 1) * take,
                take: take,
                where: {
                    userId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.bucket.count({
                where: { userId: userId },
            }),
        ])

        return new PaginatedBucketDto(buckets, page, take, totalBuckets)
    }

    async findOne(bucketId: number, userId: number) {
        const bucket = await this.prisma.bucket.findUnique({
            where: {
                bucketId: bucketId,
            },
            include: {
                bucketLink: {
                    select: {
                        link: true,
                    },
                },
            },
        })
        if (bucket.isShared === false && userId !== bucket.userId) {
            throw new BucketUnauthorizedUserException()
        }
        const bucketResponse = {
            userId: bucket.userId,
            title: bucket.title,
            linkCount: bucket.linkCount,
            createdAt: bucket.createdAt,
            isShared: bucket.isShared,
            links: bucket.bucketLink.map(data => data.link),
        }

        return bucketResponse
    }

    async updateShare(bucketId: number, permission: boolean) {
        const bucket = await this.prisma.bucket.update({
            where: {
                bucketId: bucketId,
            },
            data: {
                isShared: permission,
            },
        })

        return {
            isShared: bucket.isShared,
            shareURL: bucket.isShared ? `${process.env.URL}/bucket/${bucketId}` : '',
        }
    }
}
