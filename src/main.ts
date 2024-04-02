import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { generateOpenApi } from '@ts-rest/open-api'

import { AppModule } from './app.module'
import { contact } from './utils/ts-rest'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = generateOpenApi(contact, {
    info: {
      title: 'Novels API',
      version: '1.0.0',
    },
  });

  SwaggerModule.setup('api', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
