import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';
import { User } from 'src/user/schema/user.schema';
import { Member } from './schema/member.schema';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createMemberDto: CreateMemberDto, owner: string) {
    let till12,
      { accId, email } = createMemberDto;

    let isUser = await this.userModel.findOne({ email: email });
    if (!isUser) {
      till12 = { Error: 'User is not Found!' };
      return till12;
    }
    let isMem = await this.memberModel.findOne({
      accId: accId,
      memberId: isUser.id,
    });
    if (isMem) {
      till12 = {
        Error: 'This user is already member of this account!',
        Member: isMem,
      };
      return till12;
    }

    let isAcc = await this.accountModel.findOne({
      _id: accId,
      owner: owner,
    });
    if (!isAcc) {
      till12 = { Error: 'Account is not Found!' };
      return till12;
    }

    if (isUser.id == isAcc.owner) {
      till12 = { Error: 'The user is owner of this account!' };
      return till12;
    }

    return await this.memberModel.create({
      accId: accId,
      memberId: isUser.id,
    });
  }

  async isMember(accId: string, userId: string) {
    let till12,
      isUser = await this.userModel.count({ _id: userId });

    if (!isUser) {
      till12 = { Error: 'User is not Found!' };
      return till12;
    }
    let isAcc = await this.accountModel.findOne({ _id: accId });
    if (!isAcc) {
      till12 = { Error: 'AccountId is Incorrect!' };
      return till12;
    }
    let validUser = await this.accountModel.findOne({
      _id: accId,
      owner: userId,
    });

    if (!validUser) {
      validUser = await this.memberModel.findOne({
        accId: accId,
        memberId: userId,
      });
    }
    if (validUser) till12 = { Status: true };
    else till12 = { Status: false };

    return till12;
  }

  async accMember(userId: string) {
    return await this.memberModel
      .find({ memberId: userId })
      .select(['accId'])
      .populate('accId', ['accName', 'balance', 'owner']);
  }
}
