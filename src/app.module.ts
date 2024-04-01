import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NovelsModule } from './novels/novels.module'
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [NovelsModule, GenresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
