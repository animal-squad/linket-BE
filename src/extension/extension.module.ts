import { Module } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { HttpModule } from '@nestjs/axios'
import { BucketService } from '../bucket/bucket.service'
import { LinkService } from '../link/link.service'
import { ExtensionController } from './extension.controller'

@Module({
    imports: [HttpModule],
    providers: [BucketService, LinkService, UserService],
    controllers: [ExtensionController],
})
export class ExtensionModule {}
