import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { setUpSession } from './session/init.session'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: `${process.env.URL}`,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        exposedHeaders: ['set-cookie'],
    })
    const config = new DocumentBuilder().setTitle('Test').setDescription('swagger API documentation test').setVersion('1.0').build()
    await setUpSession(app)

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
    await app.listen(3000)
}
bootstrap()
