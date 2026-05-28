import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequest, LoginResponse, RoleSelectRequest, UserRole } from '../types';

@Injectable()
export class AuthService {
  login(payload: LoginRequest): LoginResponse {
    if (!payload.userId?.trim() || !payload.password?.trim()) {
      throw new UnauthorizedException('ユーザーIDとパスワードを入力してください');
    }

    return {
      token: `mock-token-${payload.userId.trim()}`,
      userId: payload.userId.trim(),
    };
  }

  selectRole(payload: RoleSelectRequest): { role: UserRole } {
    return { role: payload.role };
  }
}
