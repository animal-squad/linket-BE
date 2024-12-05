import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class BucketNotFoundException extends HttpException {
    constructor() {
        super(
            {
                name: 'BucketNotFound',
                statusCode: HttpStatus.NOT_FOUND,
                errorCode: 701,
                message: 'Invalid BucketId',
            },
            HttpStatus.NOT_FOUND,
        )
    }
}

export class AIResponseNoDataException extends HttpException {
    constructor() {
        super(
            {
                name: 'AIResponseNoData',
                statusCode: HttpStatus.BAD_REQUEST,
                errorCode: 702,
                message: 'AI Response not found',
            },
            HttpStatus.BAD_REQUEST,
        )
    }
}

export class ClassificationFailException extends HttpException {
    constructor() {
        super(
            {
                name: 'ClassificationFail',
                statusCode: HttpStatus.BAD_REQUEST,
                errorCode: 703,
                message: 'Error during AI classification operation',
            },
            HttpStatus.BAD_REQUEST,
        )
    }
}

export class ClassificationFailResponse {
    @ApiProperty({ description: 'error name', example: 'ClassificationFail' })
    name: string

    @ApiProperty({ description: 'http status code', example: '400' })
    statusCode: number

    @ApiProperty({ description: 'error code', example: '703' })
    errorCode: number

    @ApiProperty({ description: 'error message', example: 'Error during AI classification operation' })
    message: string
}
