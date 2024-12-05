import { ApiProperty } from '@nestjs/swagger'
import { LinkDto } from '../../link/dto/link.dto'
import { IsOptional } from 'class-validator'

export class CreateBucketDto {
    @IsOptional()
    @ApiProperty({ description: 'Title of the bucket' })
    title: string

    @ApiProperty({ description: 'Links of the bucket' })
    links: InputLinkDto[]

    @ApiProperty({ description: 'User email' })
    email: string
}

export class InputLinkDto {
    @ApiProperty({ description: 'Link URL', example: 'https://youtube.com' })
    URL: string

    @IsOptional()
    @ApiProperty({ description: 'Link content' })
    content?: string
}

export class BucketDto {
    @ApiProperty({ description: 'User id', example: 1 })
    userId: number

    @ApiProperty({ description: '바구니 제목', example: '테스트 바구니' })
    title: string

    @ApiProperty({ description: '링크 수', example: 1 })
    linkCount: number

    @ApiProperty({ description: '바구니 생성일', example: new Date() })
    createdAt: Date

    @ApiProperty({ description: '바구니 공유 여부', example: true })
    isShared: boolean

    @ApiProperty({
        description: '바구니에 담긴 링크 정보',
        example: [
            {
                linkId: 'VxLHY9N9',
                userId: 1,
                URL: 'www.naver.com',
                createdAt: '2024-11-09T16:05:48.292Z',
                openedAt: '2024-11-09T16:05:48.292Z',
                views: 0,
                tags: ['검색', '도구'],
                title: '네이버',
            },
        ],
    })
    links: LinkDto[]
}

export class CreateBucketResponseDto {
    @ApiProperty({ description: '생성된 바구니 id', example: 'Hs2is35E' })
    bucketId: string
}

export class BucketResponseDto {
    @ApiProperty({ description: 'user id', example: 1 })
    userId: number

    @ApiProperty({ description: '바구니 제목', example: '테스트 바구니' })
    title: string

    @ApiProperty({ description: '링크 수', example: 1 })
    linkCount: number

    @ApiProperty({ description: '바구니 생성일', example: new Date() })
    createdAt: Date

    @ApiProperty({ description: '바구니 공유 여부', example: false })
    isShared: boolean

    @ApiProperty({ description: '바구니 주인 여부', example: true })
    isMine: boolean

    @ApiProperty({
        description: '바구니에 담긴 링크 정보',
        example: [
            {
                linkId: 'VxLHY9N9',
                userId: 1,
                URL: 'www.naver.com',
                createdAt: '2024-11-09T16:05:48.292Z',
                openedAt: '2024-11-09T16:05:48.292Z',
                views: 0,
                tags: ['검색', '도구'],
                keywords: ['검색엔진', '지식인', '뉴스'],
                title: '네이버',
            },
        ],
    })
    links: LinkDto[]
}

export class UpdateShareDto {
    @ApiProperty({ description: '공유 여부', example: true })
    permission: boolean
}

export class UpdateShareResponseDto {
    @ApiProperty({ description: '공유 여부', example: true })
    isShared: boolean

    @ApiProperty({ description: '공유된 바구니의 링크', example: 'https://link-bucket.animal-squad.uk/Hs2is35E' })
    shareURL: string
}

export class UpdateTitleDto {
    @ApiProperty({ description: '변경할 제목', example: '멋진 제목의 바구니' })
    title: string
}
