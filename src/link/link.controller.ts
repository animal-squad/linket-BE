import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { LinkService } from './link.service'
import { TagService } from '../tag/tag.service'
import { CreateTagDto } from '../tag/dto/tag.dto'

@Controller('link')
export class LinkController {
    constructor(
        private readonly linkService: LinkService,
        private tagService: TagService,
    ) {}

    @Post('/update')
    async updateTagsAndTitle(@Body() createTagDto: CreateTagDto, @Res() res: Response) {
        await this.linkService.updateTagAndTitle(createTagDto)
        return res.status(201).json('ok')
    }
}
