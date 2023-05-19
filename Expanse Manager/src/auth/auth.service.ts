import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload): string {
    let user = { userId: payload.id };
    return this.jwtService.sign(user, {
      secret: process.env.JWT_KEY,
      expiresIn: '2h',
    });
  }
}
