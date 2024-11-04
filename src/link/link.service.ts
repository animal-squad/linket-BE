import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBucketDto } from '../bucket/dto/bucket.dto'
import { CreateTagDto } from '../tag/dto/tag.dto'
import { TagService } from '../tag/tag.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class LinkService {
    constructor(
        private prisma: PrismaService,
        private tagService: TagService,
    ) {}

    async createManyAndMapping(createBucketDto: CreateBucketDto, userId: number, bucketId: number) {
        await this.prisma.$transaction(async tx => {
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

    async updateTagAndTitle(createTagDto: CreateTagDto) {
        const tags = await this.tagService.createOrUpdate(createTagDto)

        await this.prisma.$executeRaw`
        UPDATE "Link" AS l
        SET
            title = c.title,
            tags = c.tags::integer[]
        FROM (VALUES
            ${Prisma.join(
                createTagDto.links.map(
                    link =>
                        Prisma.sql`(
                        ${link.linkId}, 
                        ${link.title}, 
                        ARRAY[${Prisma.join(link.tags.map(tag => tags.get(tag)))}]
                    )`,
                ),
            )}
        ) AS c(linkId, title, tags)
        WHERE l."linkId" = c.linkId
        `

        return
    }
}
