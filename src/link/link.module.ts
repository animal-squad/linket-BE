import { Module } from '@nestjs/common'
import { LinkService } from './link.service'
import { LinkController } from './link.controller'
import { TagService } from '../tag/tag.service'

@Module({
    controllers: [LinkController],
    providers: [LinkService, TagService],
})
export class LinkModule {}
