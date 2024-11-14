import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { setUpSession } from './session/init.session'
import * as morgan from 'morgan'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: `${process.env.URL}`,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        exposedHeaders: ['set-cookie'],
    })

    morgan.token('header', (req, res, param: string | number | boolean) => {
        let headerName: string
        if (typeof param === 'string') headerName = param
        else if (typeof param === 'number') headerName = param.toString()
        else headerName = String(param)

        const value = res.getHeader(headerName)
        if (typeof value === 'string') return value
        if (typeof value === 'number') return value.toString()
        if (Array.isArray(value)) return value.join(', ')
        return ''
    })

    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :header[set-cookie]'))
    const config = new DocumentBuilder().setTitle('Test').setDescription('swagger API documentation test').setVersion('1.0').build()
    await setUpSession(app)

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
    await app.listen(3000)
}
bootstrap()
