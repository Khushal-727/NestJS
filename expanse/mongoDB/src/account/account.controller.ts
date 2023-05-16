import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { MemberService } from 'src/member/member.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createAccountDto: CreateAccountDto,
    @Res() res,
  ) {
    let { userId } = req.userData;
    createAccountDto.owner = userId;

    let acc = await this.accountService.create(createAccountDto, userId);
    if (!acc) {
      return res.json({
        Message: 'Account Name is Already Used',
      });
    }
    res.json({
      Message: 'Account Created',
      Account: acc,
    });
  }

  @Get()
  async findAll(@Req() req, @Res() res) {
    let { userId } = req.userData;
    let accounts = await this.accountService.getAll(userId);

    if (!accounts.Owner[0] && !accounts.Member[0]) {
      return res.json({
        Message: 'No Account Found!! List is Empty',
      });
    }

    res.json({
      Message: 'List of Accounts',
      Count: accounts.Owner.length + accounts.Member.length,
      Owner: accounts.Owner.length > 0 ? accounts.Owner : undefined,
      Member:
        accounts.Member.length > 0
          ? accounts.Member.map((val) => {
              return val.accId;
            })
          : undefined,
    });
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') accId: string, @Res() res) {
    let { userId } = req.userData;
    let acc = await this.accountService.getOne(accId, userId);
    if (!acc) {
      return res.json({
        Message: 'No Account Found',
      });
    }
    res.json({
      Message: 'Account Detail',
      Account: acc,
    });
  }

  @Patch('/')
  async update(
    @Req() req,
    @Param('id') accId: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Res() res,
  ) {
    let { userId } = req.userData;

    let acc = await this.accountService.update(accId, updateAccountDto, userId);
    if (acc.Error) {
      return res.json({
        Error: acc.Error,
      });
    }
    res.json({
      Message: 'Account is Updated',
      Account: acc,
    });
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') accId: string, @Req() req) {
    let { userId } = req.userData;

    let acc = await this.accountService.remove(accId, userId);
    if (!acc) {
      return res.json({
        Message: 'No Account Found',
      });
    }
    res.json({
      Message: 'Account is Deleted',
      Account: acc,
    });
  }
}
