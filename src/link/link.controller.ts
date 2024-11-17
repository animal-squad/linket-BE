import { Controller, Param, Put } from '@nestjs/common'
import { LinkService } from './link.service'
import { GetUser } from '../user/user.decorator'

@Controller('api/link')
export class LinkController {
    constructor(private readonly linkService: LinkService) {}

    @Put('/:id/view')
    async updateViews(@Param('id') linkId: string, @GetUser() userId: number) {
        return await this.linkService.updateViewsAndOpenedAt(linkId)
    }
}
