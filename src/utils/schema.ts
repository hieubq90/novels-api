import { z } from 'zod'

export const GenreSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_top: z.boolean().optional(),
  description: z.string().optional(),
})

export const ChapterSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const ChapterContent = z.object({
  content: z.string()
})

export const AuthorSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional()
})

export const NovelSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  is_new: z.boolean(),
  is_full: z.boolean(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  lastest_chapters: z.array(ChapterSchema),
  genres: z.array(GenreSchema),
  chapters: z.array(ChapterSchema),
  author: AuthorSchema,
})

export const GetNovelsResult = z.object({
  novels: z.array(NovelSchema),
  total_pages: z.number(),
  current_page: z.number(),
})