import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { SentryExceptionCaptured } from '@sentry/nestjs'
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    @SentryExceptionCaptured()
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const responseBody = {
            statusCode: httpStatus,
            error: exception instanceof Error ? exception.message : exception,
            message: exception instanceof Error ? exception.message : 'Internal Server Error',
            timestamp: new Date().toISOString(),
            path: request.url,
        }

        response.status(httpStatus).send(responseBody)
    }
}
