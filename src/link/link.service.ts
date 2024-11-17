import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateLinkDto, UpdateLinkDto } from './dto/link.dto'

@Injectable()
export class LinkService {
    constructor(private prisma: PrismaService) {}

    async createManyAndMapping(createLinkDto: CreateLinkDto[], userId: number, bucketId: string) {
        return await this.prisma.$transaction(async tx => {
            const time = new Date()
            await tx.link.createMany({
                data: createLinkDto.map(link => ({
                    URL: link.URL,
                    title: link.title,
                    tags: link.tags || [],
                    userId: userId,
                    createdAt: time,
                    openedAt: time,
                })),
            })
            const createdLinks = await tx.link.findMany({
                where: {
                    userId,
                    URL: {
                        in: createLinkDto.map(link => link.URL),
                    },
                    createdAt: time,
                },
                select: {
                    linkId: true,
                    URL: true,
                },
            })
            await tx.bucketLink.createMany({
                data: createdLinks.map(link => ({
                    linkId: link.linkId,
                    bucketId: bucketId,
                })),
            })

            const linkContentMap = new Map(createLinkDto.map(link => [link.URL, link.content || null]))
            return createdLinks.map(link => ({
                linkId: link.linkId,
                URL: link.URL,
                content: linkContentMap.get(link.URL),
            }))
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

    async updateViewsAndOpenedAt(linkId: string) {
        return this.prisma.link.update({
            where: {
                linkId: linkId,
            },
            data: {
                views: {
                    increment: 1,
                },
                openedAt: new Date(),
            },
        })
    }
}
