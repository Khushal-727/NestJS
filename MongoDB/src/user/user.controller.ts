import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    let data = await this.userService.signup(createUserDto);
    let mail;
    // mail = await this.userService.sendMail(data.user.username, data.user.email);

    mail = { messageId: 'Sent' };

    res.json({
      Message1: 'User Created',
      User: data.user,
      Message2: 'Mail ' + mail.messageId,
      Message3: 'Account Created',
      Account: data.acc,
    });
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto, @Res() res) {
    let { User, Error } = await this.userService.login(userLoginDto);

    Error
      ? res.json({ Message: 'Invalid Creadential', Error })
      : res.json({ Message: 'Login Successfull', User });
  }

  @Get('logout')
  async logout(@Req() req, @Res() res) {
    const { userId } = req.userData;
    let user = await this.userService.logout(userId);
    res.json({ Message: 'Logout Successfull', user });
  }
}
