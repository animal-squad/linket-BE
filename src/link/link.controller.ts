import { Body, Controller, Put, Res } from '@nestjs/common'
import { Response } from 'express'
import { LinkService } from './link.service'
import { UpdateLinkDto } from './dto/link.dto'

@Controller('api/link')
export class LinkController {
    constructor(private readonly linkService: LinkService) {}

    @Put('/update')
    async updateTagsAndTitle(@Body() updateLinkDto: UpdateLinkDto) {
        return this.linkService.updateTagAndTitle(updateLinkDto)
    }
}
