import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBucketDto } from '../bucket/dto/bucket.dto'
import { UpdateLinkDto } from './dto/link.dto'

@Injectable()
export class LinkService {
    constructor(private prisma: PrismaService) {}

    async createManyAndMapping(createBucketDto: CreateBucketDto, userId: number, bucketId: number) {
        return await this.prisma.$transaction(async tx => {
            await tx.link.createMany({
                data: createBucketDto.links.map(url => ({
                    URL: url,
                    userId: userId,
                })),
            })
            const createdLinks = await tx.link.findMany({
                where: {
                    userId,
                    URL: {
                        in: createBucketDto.links,
                    },
                },
                select: {
                    linkId: true,
                },
            })
            await tx.bucketLink.createMany({
                data: createdLinks.map(link => ({
                    linkId: link.linkId,
                    bucketId: bucketId,
                })),
            })
        })
    }

    async updateTagAndTitle(updateLinkDto: UpdateLinkDto) {
        return await this.prisma.$transaction(
            updateLinkDto.links.map(link =>
                this.prisma.link.update({
                    where: {
                        linkId: link.linkId,
                    },
                    data: {
                        title: link.title,
                        tags: link.tags,
                    },
                }),
            ),
        )
    }
}
