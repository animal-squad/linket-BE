import { Module } from '@nestjs/common'
import { BucketService } from './bucket.service'
import { BucketController } from './bucket.controller'
import { LinkService } from '../link/link.service'
import { UserService } from '../user/user.service'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule],
    controllers: [BucketController],
    providers: [BucketService, LinkService, UserService],
})
export class BucketModule {}
