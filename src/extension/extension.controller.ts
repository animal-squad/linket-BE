import { Body, Controller, Post, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateBucketDto, CreateBucketResponseDto } from '../bucket/dto/bucket.dto'
import { AIResponseNoDataException, ClassificationFailException, ClassificationFailResponse } from '../bucket/bucket.exception'
import { Response } from 'express'
import { NotRegisterUserException } from '../user/user.exception'
import { firstValueFrom } from 'rxjs'
import { BucketService } from '../bucket/bucket.service'
import { LinkService } from '../link/link.service'
import { UserService } from '../user/user.service'
import { HttpService } from '@nestjs/axios'

@ApiTags('Extension API')
@Controller('api/extension')
export class ExtensionController {
    constructor(
        private readonly bucketService: BucketService,
        private linkService: LinkService,
        private readonly userService: UserService,
        private httpService: HttpService,
    ) {}

    @ApiOperation({
        summary: '바구니 추가 API',
        description: '익스텐션을 통해 받아온 탭 정보를 바구니로 저장하고, AI 서버를 호출해 받아온 정보를 바탕으로 링크의 제목과 태그를 수정',
    })
    @ApiBody({ description: '받아오는 탭 정보', type: CreateBucketDto })
    @ApiResponse({ status: 201, description: '바구니 저장 성공', type: CreateBucketResponseDto })
    @ApiResponse({ status: 400, description: 'AI 호출 중 오류 발생', type: ClassificationFailResponse })
    @Post('/')
    async create(@Body() createBucketDto: CreateBucketDto, @Res() res: Response) {
        const user = await this.userService.findByEmail(createBucketDto.email)
        if (!user) {
            throw new NotRegisterUserException()
        } else {
            const bucketId = await this.bucketService.create(createBucketDto, user.userId)
            const links = await this.linkService.createManyAndMapping(createBucketDto.links, user.userId, bucketId)
            res.status(201).send(bucketId)

            try {
                const aiResponse = await firstValueFrom(
                    this.httpService.post(`${process.env.URL}/ai/categorize`, { links: links }, { timeout: 60000 }),
                )

                if (!aiResponse.data) {
                    throw new AIResponseNoDataException()
                }
                const updateLinkDto = aiResponse.data

                return this.linkService.updateTagAndTitle(updateLinkDto)
            } catch (err) {
                throw new ClassificationFailException()
            }
        }
    }
}
