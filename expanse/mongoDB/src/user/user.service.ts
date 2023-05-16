import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { compare } from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailerService,
    private accountService: AccountService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userModel.create(createUserDto);
      let data: CreateAccountDto;
      data = { accName: newUser.username, balance: 0, owner: newUser.id };

      let acc = await this.accountService.create(data, newUser.id);
      let data1 = { user: newUser, acc: acc };

      return data1;
    } catch {
      throw new ConflictException('Email is already in used');
    }
  }

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    const isUser = await this.userModel.findOne({ email: email });
    if (!isUser) {
      return { Error: 'User not found' };
    }

    const isMatch = await compare(password, isUser.password);
    if (!isMatch) throw new UnauthorizedException('password is invalid');

    const token = await this.jwtService.signAsync(
      { userId: isUser.id },
      { secret: process.env.JWT_KEY, expiresIn: '8h' },
    );

    await this.userModel.updateOne({ _id: isUser.id }, { token: token });

    let thisUser = await this.userModel
      .findOne({
        _id: isUser.id,
      })
      .select(['username', 'email', 'password', 'token']);

    return { User: thisUser };
  }

  async logout(id: string) {
    let user = await this.userModel
      .findByIdAndUpdate({ _id: id }, { token: '' })
      .select(['email', 'token']);
    return user;
  }

  async sendMail(name: string, revMail: string) {
    return await this.mailService.sendMail({
      to: revMail,
      from: 'ztlab@mail.com',
      subject: 'Welcome to Zignuts',
      text:
        ` \t\t UserName: ${name}, Email: ${revMail}` +
        ' \n\t      Happy to serve this service to manage your expense.',
    });
  }
}
