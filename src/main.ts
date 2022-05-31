import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters.http-exception.filter'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
  app.useGlobalInterceptors(new WrapResponseInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor() // 👈
  )

  /* Add manual timeout to force timeout interceptor to work */
  await app.listen(3001)
}
bootstrap()
