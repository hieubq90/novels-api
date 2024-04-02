import {
    ChapterContent, ChapterSchema, GenreSchema, GetNovelsResult, NovelSchema
} from 'src/utils/schema'
import { z } from 'zod'

export type Genre = z.infer<typeof GenreSchema>
export type Novel = z.infer<typeof NovelSchema>
export type Chapter = z.infer<typeof ChapterSchema>
export type IGetNovels = z.infer<typeof GetNovelsResult>
export type IChapterContent = z.infer<typeof ChapterContent>