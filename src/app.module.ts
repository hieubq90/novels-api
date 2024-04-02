import { join } from 'path'

import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GenresModule } from './genres/genres.module'
import { NovelsModule } from './novels/novels.module'

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
    serveRoot: "",
    exclude: ['/api/(.*)'],
  }), NovelsModule, GenresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
