import { HttpException, HttpStatus } from '@nestjs/common'

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

export class AIResponseFailException extends HttpException {
    constructor() {
        super(
            {
                name: 'AIResponseFail',
                statusCode: HttpStatus.BAD_REQUEST,
                errorCode: 702,
                message: 'Response Not Found',
            },
            HttpStatus.BAD_REQUEST,
        )
    }
}
