import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    let token = req.header('authorization');
    if (!token) {
      throw new HttpException('Token stream is empty', 409);
    }

    try {
      token = req.headers.authorization.split(' ')[1];
      let decoded = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_KEY,
        }),
        user = await this.userModel.findOne({ _id: decoded.userId });

      if (token == user.token) {
        req.userData = decoded;
        next();
      } else {
        throw new HttpException('Token Not Match!!', 401);
      }
    } catch (err) {
      if (err.expiredAt) {
        throw new HttpException('Token Expire: ' + err.expiredAt, 401);
      }
      throw new HttpException('Token is Invalid', 401);
    }
  }
}
