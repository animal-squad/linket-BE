import { Module } from '@nestjs/common'
import { LinkService } from './link.service'
import { LinkController } from './link.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule],
    controllers: [LinkController],
    providers: [LinkService],
})
export class LinkModule {}
