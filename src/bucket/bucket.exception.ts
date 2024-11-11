import { HttpException, HttpStatus } from '@nestjs/common'

export class BucketNotFoundException extends HttpException {
    constructor() {
        super(
            {
                name: 'BucketNotFound',
                statusCode: HttpStatus.NOT_FOUND,
                errorCode: 701,
                message: 'Can not find bucket',
            },
            HttpStatus.NOT_FOUND,
        )
    }
}