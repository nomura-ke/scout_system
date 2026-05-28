import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    if (req.path.startsWith('/api/auth')) {
      return next();
    }

    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('認証ヘッダーが必要です');
    }

    next();
  }
}
