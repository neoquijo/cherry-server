import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { User } from 'src/auth/owner.decorator';

@UseGuards()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationService) {}

  @Get('/')
  async getAll(@User() user) {
    return await this.organizations.getOrganization(user._id);
  }
}
