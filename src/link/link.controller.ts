import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { LinkService } from './link.service'
import { GetUser } from '../user/user.decorator'
import { CreateLinkDto } from './dto/link.dto'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { PaginatedLinkDto, PaginationQueryDto } from '../utils/pagination.dto'
import { Link } from '@prisma/client'

@Controller('api/link')
export class LinkController {
    constructor(
        private readonly linkService: LinkService,
        private httpService: HttpService,
    ) {}

    @Put('/:id/view')
    async updateViews(@Param('id') linkId: string, @GetUser() userId: number) {
        return await this.linkService.updateViewsAndOpenedAt(linkId)
    }

    @Put('/:id/title')
    async updateTitle(@Param('id') linkId: string, @Body('title') title: string, @GetUser() userId: number) {
        return await this.linkService.updateTitle(linkId, title)
    }

    @Put('/:id/tag')
    async updateTags(@Param('id') linkId: string, @Body('tags') tags: string[], @GetUser() userId: number) {
        return await this.linkService.updateTags(linkId, tags)
    }

    @Post()
    async createLink(@Body() createLinkDto: CreateLinkDto, @GetUser() userId: number) {
        const link = await this.linkService.createOne(createLinkDto, userId)

        const aiResponse = await firstValueFrom(this.httpService.post(`${process.env.URL}/ai/categorize`, { links: [link] }, { timeout: 60000 }))

        const updateLinkDto = aiResponse.data

        return await this.linkService.updateTagAndTitle(updateLinkDto)
    }

    @Delete()
    async deleteLinks(@Body('linkId') linkId: string[], @GetUser() userId: number) {
        return this.linkService.deleteLinks(linkId)
    }

    @Get()
    async getLinks(@Query() query: PaginationQueryDto, @Body('tags') tags: string[], @GetUser() userId: number): Promise<PaginatedLinkDto<Link>> {
        return this.linkService.getLinks(query, tags, userId)
    }
}
