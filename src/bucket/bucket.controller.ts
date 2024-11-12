import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Put } from '@nestjs/common'
import { Response } from 'express'
import { BucketService } from './bucket.service'
import { BucketDto, CreateBucketDto } from './dto/bucket.dto'
import { LinkService } from '../link/link.service'
import { UserService } from '../user/user.service'
import { NotRegisterUserException } from '../user/user.exception'
import { GetUser } from '../user/user.decorater'
import { User, Bucket } from '@prisma/client'
import { PaginatedBucketDto, PaginationQueryDto } from '../utils/pagination.dto'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Controller('api/bucket')
export class BucketController {
    constructor(
        private readonly bucketService: BucketService,
        private linkService: LinkService,
        private readonly userService: UserService,
        private httpService: HttpService,
    ) {}

    @Post('/')
    async create(@Body() createBucketDto: CreateBucketDto, @Res() res: Response) {
        const user = await this.userService.findByEmail(createBucketDto.email)
        if (!user) {
            throw new NotRegisterUserException()
        } else {
            const bucketId = await this.bucketService.create(createBucketDto, user.userId)
            const links = await this.linkService.createManyAndMapping(createBucketDto.links, user.userId, bucketId)

            res.status(201).send(bucketId)

            const aiResponse = await firstValueFrom(this.httpService.post(`${process.env.URL}/ai/categorize`, { links : links }, { timeout : 60000 }))

            const updateLinkDto = aiResponse.data

            return this.linkService.updateTagAndTitle(updateLinkDto)
        }
    }

    @Get('/')
    async getAll(@Query() query: PaginationQueryDto, @GetUser() user: User): Promise<PaginatedBucketDto<Bucket>> {
        return await this.bucketService.findAll(user.userId, query)
    }

    @Get('/:id')
    async getById(@Param('id') bucketId: string, @GetUser() user: User) {
        return await this.bucketService.findOne(bucketId, user.userId)
    }

    @Put('/:id/share')
    async updateIsShared(@Param('id') bucketId: string, @Body('permission') permission: boolean) {
        return await this.bucketService.updateShare(bucketId, permission)
    }

    @Post('/:id/paste')
    async addPasteBucket(@Param('id') id: string, @Body('bucket') bucket: BucketDto, @GetUser() user: User) {
        return await this.bucketService.createPastedBucket(bucket, user.userId)
    }

    @Put('/:id')
    async updateTitle(@Param('id') bucketId: string, @Body('title') title: string, @GetUser() user: User) {
        return await this.bucketService.updateBucketTitle(title, bucketId, user.userId)
    }

    @Delete('/:id')
    async deleteBucekt(@Param('id') bucketId: string, @GetUser() user: User) {
        return await this.bucketService.deleteBucket(bucketId, user.userId)
    }
}
