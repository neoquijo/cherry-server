import { Controller, Get } from '@nestjs/common';
import { BusinessOwnersService } from './businessOwners.service';

@Controller('owners')
export class BusinesOwnersController {
  constructor(private readonly businesOwners: BusinessOwnersService) {}

  @Get('/')
  getAll() {
    return this.businesOwners.getAll();
  }
}
