import { HttpException, HttpStatus } from '@nestjs/common'

export class NotRegisterUserException extends HttpException {
    constructor() {
        super(
            {
                name: 'NotRegisterUser',
                statusCode: HttpStatus.UNAUTHORIZED,
                errorCode: 601,
                message: 'Email is not registered',
            },
            HttpStatus.UNAUTHORIZED,
        )
    }
}

export class NotLoginException extends HttpException {
    constructor() {
        super(
            {
                name: 'NotLogin',
                statusCode: HttpStatus.UNAUTHORIZED,
                errorCode: 602,
                message: 'Only authorized users can access',
            },
            HttpStatus.UNAUTHORIZED,
        )
    }
}

export class BucketUnauthorizedUserException extends HttpException {
    constructor() {
        super(
            {
                name: 'BucketUnauthorizedUser',
                statusCode: HttpStatus.FORBIDDEN,
                errorCode: 603,
                message: 'Only authorized users can access',
            },
            HttpStatus.FORBIDDEN,
        )
    }
}

export class NotBucketOwnerException extends HttpException {
    constructor() {
        super(
            {
                name: 'NotBucketOwner',
                statusCode: HttpStatus.FORBIDDEN,
                errorCode: 604,
                message: 'Only Owner can make changes',
            },
            HttpStatus.FORBIDDEN,
        )
    }
}
