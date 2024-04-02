import { Scraper } from 'src/utils/scraper'

import { Injectable } from '@nestjs/common'

@Injectable()
export class NovelsService {
  async getNewNovels(gid?: string, page?: number) {
    try {
      const novels = await Scraper.getNewNovels(gid, page)
      return novels
    } catch (err) {
      throw err;
    }
  }

  async getHotNovels(gid?: string, page?: number) {
    try {
      const novels = await Scraper.getHotNovels(gid, page)
      return novels
    } catch (err) {
      throw err;
    }
  }

  async getFullNovels(gid?: string, page?: number) {
    try {
      const novels = await Scraper.getFullNovels(gid, page)
      return novels
    } catch (err) {
      throw err;
    }
  }

  async getNovelsOfAuthor(aid?: string) {
    try {
      const novels = await Scraper.getNovelsOfAuthor(aid)
      return novels
    } catch (err) {
      throw err;
    }
  }

  async getChapters(nid: string) {
    try {
      const chapters = await Scraper.getChapters(nid)
      return chapters
    } catch (err) {
      throw err;
    }
  }

  async getNovelDetail(nid: string) {
    try {
      const novel = await Scraper.getNovelDetail(nid)
      return novel
    } catch (err) {
      throw err;
    }
  }

  async getChapterContent(nid: string, cid: string) {
    try {
      const novel = await Scraper.getChapterContent(nid, cid)
      return novel
    } catch (err) {
      throw err;
    }
  }

}
