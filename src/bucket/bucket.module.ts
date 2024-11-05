import { Module } from '@nestjs/common'
import { BucketService } from './bucket.service'
import { BucketController } from './bucket.controller'
import { LinkService } from '../link/link.service'

@Module({
    controllers: [BucketController],
    providers: [BucketService, LinkService],
})
export class BucketModule {}
