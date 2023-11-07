import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { BusinessOwnersModule } from 'src/businessOwners/businessOwners.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    BusinessOwnersModule,
    OrganizationsModule,
    JwtModule.register({
      secret: 'estoesunsecretomuuuydificil',
      signOptions: {
        expiresIn: '200h',
      },
    }),
  ],
})
export class AuthModule {}
