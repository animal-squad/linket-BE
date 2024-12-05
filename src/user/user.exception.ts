import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

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

export class NotLoginResponse {
    @ApiProperty({ description: 'error name', example: 'NotLogin' })
    name: string

    @ApiProperty({ description: 'http status code', example: '401' })
    statusCode: number

    @ApiProperty({ description: 'error code', example: '602' })
    errorCode: number

    @ApiProperty({ description: 'error message', example: 'Only authorized users can access' })
    message: string
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

export class BucketUnauthorizedUserResponse {
    @ApiProperty({ description: 'error name', example: 'BucketUnauthorized' })
    name: string

    @ApiProperty({ description: 'http status code', example: 403 })
    statusCode: number

    @ApiProperty({ description: 'error message', example: 603 })
    errorCode: number

    @ApiProperty({ description: 'error message', example: 'Only authorized users can access' })
    message: string
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

export class NotBucketOwnerResponse {
    @ApiProperty({ description: 'error name', example: 'NotBucketOwner' })
    name: string

    @ApiProperty({ description: 'http status code', example: 403 })
    statusCode: number

    @ApiProperty({ description: 'error code', example: 604 })
    errorCode: number

    @ApiProperty({ description: 'error message', example: 'Only Owner can make changes' })
    message: string
}
