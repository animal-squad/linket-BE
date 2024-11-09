import { Body, Controller, Put, Res } from '@nestjs/common'
import { Response } from 'express'
import { LinkService } from './link.service'
import { UpdateLinkDto } from './dto/link.dto'

@Controller('api/link')
export class LinkController {
    constructor(private readonly linkService: LinkService) {}

    @Put('/update')
    async updateTagsAndTitle(@Body() updateLinkDto: UpdateLinkDto, @Res() res: Response) {
        await this.linkService.updateTagAndTitle(updateLinkDto)
        return res.sendStatus(201)
    }
}
