import { GenreSchema } from 'src/utils/schema'
import { z } from 'zod'

export type Genre = z.infer<typeof GenreSchema>