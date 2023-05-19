import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('add')
  async create(
    @Req() req,
    @Body() createMemberDto: CreateMemberDto,
    @Res() res,
  ) {
    let { userId } = req.userData;
    let { accId, email } = createMemberDto;

    let isMem = await this.memberService.create({ accId, email }, userId);
    if (isMem.Error) {
      return res.json(isMem);
    }
    res.json({
      Message: 'Member is Added',
      Member: isMem,
    });
  }

  @Post('check')
  async isMember(@Req() req, @Body() reqBody, @Res() res) {
    let { userId } = req.userData;
    let { accId } = reqBody;

    let isValid = await this.memberService.isMember(accId, userId);
    console.log(isValid);

    res.json({
      Message: 'User is Owner or Member',
    });
  }

  @Get('ald')
  async accMember(@Req() req, @Res() res) {
    const { userId } = req.userData;
    let accMem = await this.memberService.accMember(userId);
    res.json({
      Message: 'member account',
      member: accMem,
    });
  }
}
