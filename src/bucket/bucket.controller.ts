import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common'
import { Response } from 'express'
import { BucketService } from './bucket.service'
import { CreateBucketDto } from './dto/bucket.dto'
import { LinkService } from '../link/link.service'
import { UserService } from '../user/user.service'
import { NotRegisterUserException } from '../user/user.exception'

@Controller('bucket')
export class BucketController {
    constructor(
        private readonly bucketService: BucketService,
        private linkService: LinkService,
        private readonly userService: UserService,
    ) {}

    @Post('/')
    async create(@Body() createBucketDto: CreateBucketDto, @Res() res: Response) {
        const user = await this.userService.findByEmail(createBucketDto.email)
        if (!user) {
            throw new NotRegisterUserException()
        } else {
            const bucketId = await this.bucketService.create(createBucketDto, user.userId)
            const linksId = this.linkService.createManyAndMapping(createBucketDto, user.userId, bucketId)

            return res.status(201).json(bucketId)
        }
        // TODO: AI API 호출
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
