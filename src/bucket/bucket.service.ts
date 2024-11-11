import { Injectable } from '@nestjs/common'
import { BucketDto, CreateBucketDto } from './dto/bucket.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { LinkService } from '../link/link.service'
import { getTime } from '../utils/time.util'
import { PaginatedBucketDto, PaginationQueryDto } from '../utils/pagination.dto'
import { Bucket } from '@prisma/client'
import { BucketUnauthorizedUserException, NotBucketOwnerException } from '../user/user.exception'
import { BucketNotFoundException } from './bucket.exception'

@Injectable()
export class BucketService {
    constructor(
        private prisma: PrismaService,
        private readonly linkService: LinkService,
    ) {}

    private async getBucket(bucketId: string) {
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
        if (!bucket) {
            throw new BucketNotFoundException()
        }
        return bucket
    }

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

    async findOne(bucketId: string, userId: number) {
        const bucket = await this.getBucket(bucketId)

        if (bucket.isShared === false && userId !== bucket.userId) {
            throw new BucketUnauthorizedUserException()
        }

        const bucketResponse = {
            userId: bucket.userId,
            title: bucket.title,
            linkCount: bucket.linkCount,
            createdAt: bucket.createdAt,
            isShared: bucket.isShared,
            isMine: bucket.userId === userId,
            links: bucket.bucketLink.map(data => data.link),
        }

        return bucketResponse
    }

    async updateShare(bucketId: string, permission: boolean) {
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

    async createPastedBucket(bucket: BucketDto, userId: number) {
        const newBucket = await this.prisma.bucket.create({
            data: {
                title: bucket.title + ' 의 복사본',
                linkCount: bucket.linkCount,
                userId: userId,
            },
        })

        await this.linkService.createManyAndMapping(bucket.links, userId, newBucket.bucketId)

        return newBucket.bucketId
    }

    async updateBucketTitle(title: string, bucketId: string, userId: number) {
        const bucket = await this.prisma.bucket.findUnique({
            where: {
                bucketId: bucketId,
            },
        })
        if (bucket.userId !== userId) {
            throw new NotBucketOwnerException()
        }
        return this.prisma.bucket.update({
            where: {
                bucketId: bucketId,
            },
            data: {
                title: title,
            },
        })
    }

    async deleteBucket(bucketId: string, userId: number) {
        const bucket = await this.getBucket(bucketId)
        if (bucket.userId !== userId) {
            throw new NotBucketOwnerException()
        }
        const linkIds = bucket.bucketLink.map(data => data.link.linkId)
        const deleteRelation = this.prisma.bucketLink.deleteMany({
            where: {
                bucketId: bucketId,
            },
        })
        const deleteLinks = this.prisma.link.deleteMany({
            where: {
                linkId: {
                    in: linkIds,
                },
            },
        })
        const deleteBucket = this.prisma.bucket.delete({
            where: {
                bucketId: bucketId,
            },
        })
        return await this.prisma.$transaction([deleteRelation, deleteLinks, deleteBucket])
    }
}
