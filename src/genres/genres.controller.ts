import { contact } from 'src/utils/ts-rest'

import { Controller } from '@nestjs/common'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'

import { GenresService } from './genres.service'

@Controller('')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @TsRestHandler(contact.genres.get)
  async getGenres() {
    return tsRestHandler(contact.genres.get, async () => {
      const genres = await this.genresService.getAllGenres()
      return { status: 200, body: genres || [] };
    })
  }

  @TsRestHandler(contact.genres.byId)
  async getNovelsByGenreId() {
    return tsRestHandler(contact.genres.get, async () => {
      return { status: 200, body: [] };
    })
  }
}
