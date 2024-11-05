import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common'
import { Response } from 'express'
import { BucketService } from './bucket.service'
import { CreateBucketDto } from './dto/bucket.dto'
import { GetUser } from '../user/user.decorater'
import { User } from '@prisma/client'
import { LinkService } from '../link/link.service'

@Controller('bucket')
export class BucketController {
    constructor(
        private readonly bucketService: BucketService,
        private linkService: LinkService,
    ) {}

    @Post('/')
    async create(@Body() createBucketDto: CreateBucketDto, @GetUser() user: User, @Res() res: Response) {
        const bucketId = await this.bucketService.create(createBucketDto, user.userId)
        const linksId = this.linkService.createManyAndMapping(createBucketDto, user.userId, bucketId)

        // TODO: AI API 호출

        return res.status(201).json(bucketId)
    }

    // @Get()
    // findAll() {
    //   return this.bucketService.findAll();
    // }
    //
    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.bucketService.findOne(+id);
    // }
    //
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateBucketDto: UpdateBucketDto) {
    //   return this.bucketService.update(+id, updateBucketDto);
    // }
    //
    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.bucketService.remove(+id);
    // }
}
