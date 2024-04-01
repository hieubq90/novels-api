import { GenreSchema, GetNovelsResult, NovelSchema } from 'src/utils/schema'
import { z } from 'zod'

export type Genre = z.infer<typeof GenreSchema>
export type Novel = z.infer<typeof NovelSchema>
export type IGetNovels = z.infer<typeof GetNovelsResult>