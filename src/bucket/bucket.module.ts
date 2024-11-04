import { Module } from '@nestjs/common'
import { BucketService } from './bucket.service'
import { BucketController } from './bucket.controller'
import { LinkService } from '../link/link.service'
import { TagService } from '../tag/tag.service'

@Module({
    controllers: [BucketController],
    providers: [BucketService, LinkService, TagService],
})
export class BucketModule {}
