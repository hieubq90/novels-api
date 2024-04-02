import { contact } from 'src/utils/ts-rest'

import { Controller } from '@nestjs/common'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'

import { NovelsService } from './novels.service'

@Controller('')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) { }

  @TsRestHandler(contact.novels.new)
  async getNewNovel() {
    return tsRestHandler(contact.novels.new, async (args) => {
      const { query } = args
      const body = await this.novelsService.getNewNovels(query.gid, query.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.novels.hot)
  async getHotNovel() {
    return tsRestHandler(contact.novels.hot, async (args) => {
      const { query } = args
      const body = await this.novelsService.getHotNovels(query.gid, query.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.novels.full)
  async getFullNovel() {
    return tsRestHandler(contact.novels.full, async (args) => {
      const { query } = args
      const body = await this.novelsService.getFullNovels(query.gid, query.page)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.novels.author)
  async getNovelOfAuthor() {
    return tsRestHandler(contact.novels.author, async (args) => {
      const { query } = args
      const body = await this.novelsService.getNovelsOfAuthor(query.aid)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.novels.chapters)
  async getChapters() {
    return tsRestHandler(contact.novels.chapters, async (args) => {
      const { params } = args
      const body = await this.novelsService.getChapters(params.nid)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.novels.detail)
  async getNovelById() {
    return tsRestHandler(contact.novels.detail, async (args) => {
      const { params } = args
      const body = await this.novelsService.getNovelDetail(params.nid)
      return { status: 200, body }
    })
  }

  @TsRestHandler(contact.novels.chapterContent)
  async getChapterContent() {
    return tsRestHandler(contact.novels.chapterContent, async (args) => {
      const { params } = args
      const body = await this.novelsService.getChapterContent(params.nid, params.cid)
      return { status: 200, body }
    })
  }
}
