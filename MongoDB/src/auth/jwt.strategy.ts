import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any): Promise<any> {
    let user = await this.userModel.findOne({ id: payload.userId });
    try {
      if (!user.token) {
        throw new UnauthorizedException({
          Message: 'Login First',
          Error: 'Invalid Token',
        });
      }

      return payload;
    } catch (error) {
      throw new HttpException({ Error: 'Token Not Found' }, 401);
    }
  }
}
