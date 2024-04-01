

import { Scraper } from 'src/utils/scraper'

import { Injectable } from '@nestjs/common'

@Injectable()
export class GenresService {
  async getAllGenres() {
    try {
      const genres = await Scraper.getGenres()
      return genres
    } catch (err) {
      throw err;
    }
  }

  async getNovelsByGenre(genreId: string, page?: number) {
    try {
      const body = await Scraper.getNovelsByGenre(genreId, page)
      return body
    } catch (err) {
      throw err;
    }
  }
}
