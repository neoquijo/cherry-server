import { Controller, Get } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationService) {}

  @Get('/')
  async getAll() {
    return await this.organizations.getAll();
  }
}
