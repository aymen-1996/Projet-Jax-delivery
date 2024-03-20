import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const jwtCookie = request.cookies['jwt'];

      if (!jwtCookie) {
        return false;
      }

      const decoded = this.jwtService.verify(jwtCookie);
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
