

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
}
