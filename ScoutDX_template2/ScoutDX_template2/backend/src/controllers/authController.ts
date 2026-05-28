import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/authService';
import { LoginRequest, RoleSelectRequest } from '../types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginRequest) {
    return this.authService.login(body);
  }

  @Post('role')
  selectRole(@Body() body: RoleSelectRequest) {
    return this.authService.selectRole(body);
  }
}
