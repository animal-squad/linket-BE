import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { BodyTagDto, CreateLinkDto, DeleteLinkDto, UpdateLinkDto, UpdateTitleDto } from './dto/link.dto'
import { PaginatedLinkDto, PaginationQueryDto } from '../utils/pagination.dto'

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

    async updateTitle(linkId: string, updateTitleDto: UpdateTitleDto) {
        const title = updateTitleDto.title
        return this.prisma.link.update({
            where: {
                linkId: linkId,
            },
            data: {
                title: title,
            },
        })
    }

    async updateTags(linkId: string, updateTagDto: BodyTagDto) {
        // TODO :  변동내역 로깅
        const tags = updateTagDto.tags
        return this.prisma.link.update({
            where: {
                linkId: linkId,
            },
            data: {
                tags: tags,
            },
        })
    }

    async createOne(createLinkDto: CreateLinkDto, userId: number) {
        const link = await this.prisma.link.create({
            data: {
                URL: createLinkDto.URL,
                userId: userId,
            },
        })
        return {
            linkId: link.linkId,
            URL: link.URL,
            content: null,
        }
    }

    async deleteLinks(deleteLinkDto: DeleteLinkDto) {
        const linkId = deleteLinkDto.linkId
        await this.prisma.bucketLink.deleteMany({
            where: {
                linkId: {
                    in: linkId,
                },
            },
        })
        return this.prisma.link.deleteMany({
            where: {
                linkId: {
                    in: linkId,
                },
            },
        })
    }

    async getLinks(query: PaginationQueryDto, tags: BodyTagDto, userId: number) {
        const page = Number(query.page) || 1
        const take = Number(query.take) || 10
        const tag = tags.tags || []

        const whereCondition: any = {
            userId: userId,
        }

        if (tag.length > 0) {
            whereCondition.tags = {
                hasSome: tag,
            }
        }

        const [links, totalLinks] = await Promise.all([
            this.prisma.link.findMany({
                skip: (page - 1) * take,
                take: take,
                where: whereCondition,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.link.count({
                where: whereCondition,
            }),
        ])

        return new PaginatedLinkDto(links, page, take, tag, totalLinks)
    }
}
