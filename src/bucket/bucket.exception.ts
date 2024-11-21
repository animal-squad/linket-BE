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
