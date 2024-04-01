import { Controller } from '@nestjs/common'

import { NovelsService } from './novels.service'

@Controller('')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) {}
}
