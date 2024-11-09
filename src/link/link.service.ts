import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateLinkDto, UpdateLinkDto } from './dto/link.dto'
import { getTime } from '../utils/time.util'

@Injectable()
export class LinkService {
    constructor(private prisma: PrismaService) {}

    async createManyAndMapping(createLinkDto: CreateLinkDto[], userId: number, bucketId: number) {
        return await this.prisma.$transaction(async tx => {
            await tx.link.createMany({
                data: createLinkDto.map(link => ({
                    URL: link.URL,
                    title: link.title,
                    tags: link.tags || [],
                    userId: userId,
                    createdAt: getTime(),
                    openedAt: getTime(),
                })),
            })
            const createdLinks = await tx.link.findMany({
                where: {
                    userId,
                    URL: {
                        in: createLinkDto.map(link => link.URL),
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
