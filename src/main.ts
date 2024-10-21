import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { setUpSession } from './session/init.session'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder().setTitle('Test').setDescription('swagger API documentation test').setVersion('1.0').build()

    setUpSession(app)

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(3000)
}
bootstrap()
