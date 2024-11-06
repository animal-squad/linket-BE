import { Injectable } from '@nestjs/common'
import { CreateBucketDto } from './dto/bucket.dto'
import { PrismaService } from '../../prisma/prisma.service'
import { LinkService } from '../link/link.service'
import { getTime } from '../utils/time.util'

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
                createdAt: getTime(),
            },
        })
        return bucket.bucketId
    }
}
