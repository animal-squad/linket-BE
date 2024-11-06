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
