import { z } from 'zod'

import { initContract } from '@ts-rest/core'

import { ChapterContent, ChapterSchema, GenreSchema, GetNovelsResult, NovelSchema } from './schema'

const c = initContract();

const genre = c.router({
  get: {
    method: 'GET',
    path: '/genres',
    responses: {
      200: z.array(GenreSchema).min(0),
    },
    summary: 'Get all genres',
  },
  byId: {
    method: 'GET',
    path: '/genres/:gid',
    pathParams: z.object({
      gid: z.string(),
    }),
    query: z.object({
      page: z.string().transform(Number).optional(),
    }),
    responses: {
      200: GetNovelsResult,
    },
    summary: 'Get novels by genre id',
  },
})

const novel = c.router(
  {
    new: {
      method: 'GET',
      path: '/novels/new',
      responses: {
        200: GetNovelsResult,
      },
      query: z.object({
        gid: z.string().optional(),
        page: z.string().transform(Number).optional(),
      }),
      summary: 'get new novels',
    },
    hot: {
      method: 'GET',
      path: '/novels/hot',
      responses: {
        200: GetNovelsResult,
      },
      query: z.object({
        gid: z.string().optional(),
        page: z.string().transform(Number).optional(),
      }),
      summary: 'get full novels',
    },
    full: {
      method: 'GET',
      path: '/novels/full',
      responses: {
        200: GetNovelsResult,
      },
      query: z.object({
        gid: z.string().optional(),
        page: z.string().transform(Number).optional(),
      }),
      summary: 'get full novels',
    },
    author: {
      method: 'GET',
      path: '/novels/author',
      responses: {
        200: GetNovelsResult,
      },
      query: z.object({
        aid: z.string().optional(),
        page: z.string().transform(Number).optional(),
      }),
      summary: 'get novels of author',
    },
    detail: {
      method: 'GET',
      path: '/novels/detail/:nid',
      pathParams: z.object({
        nid: z.string(),
      }),
      responses: {
        200: NovelSchema,
      },
      summary: 'get full novels',
    },
    chapters: {
      method: 'GET',
      path: '/novels/detail/:nid/chapters',
      pathParams: z.object({
        nid: z.string(),
      }),
      responses: {
        200: z.array(ChapterSchema),
      },
      summary: 'get chapters',
    },
    chapterContent: {
      method: 'GET',
      path: '/novels/detail/:nid/chapters/:cid',
      pathParams: z.object({
        nid: z.string(),
      }),
      responses: {
        200: ChapterContent,
      },
      summary: 'get chapters',
    }
  }
)

export const contact = c.router({
  genres: genre,
  novels: novel,
}, { pathPrefix: "/api/v1", strictStatusCode: true })