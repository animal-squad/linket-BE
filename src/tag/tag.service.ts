import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTagDto } from './dto/tag.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) {}

    async createOrUpdate(createTagDto: CreateTagDto) {
        const tagsValue = createTagDto.links.flatMap(link => link.tags)

        const tags = await this.prisma.$transaction(async tx => {
            const tagPromise = tagsValue.map(tagName =>
                tx.tag.upsert({
                    where: {
                        userId_tagName: {
                            userId: createTagDto.userId,
                            tagName,
                        },
                    },
                    create: {
                        userId: createTagDto.userId,
                        tagName,
                        count: 1,
                    },
                    update: {
                        count: { increment: 1 },
                    },
                }),
            )
            return await Promise.all(tagPromise)
        })
        return new Map(tags.map(tag => [tag.tagName, tag.tagId]))
    }
}
