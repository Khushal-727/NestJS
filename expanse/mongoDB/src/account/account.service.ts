import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './schema/account.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Member } from 'src/member/schema/member.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createAccountDto: CreateAccountDto, userId: string) {
    const { accName } = createAccountDto;

    let isAcc = await this.accountModel.findOne({
      accName: accName,
      owner: userId,
    });
    if (isAcc) return null;

    const newAcc = await this.accountModel.create(createAccountDto);
    return newAcc;
  }

  async getAll(userId: string) {
    let acc = await this.accountModel
      .find({ owner: userId })
      .select(['accName', 'balance'])
      .exec();
    let memAcc = await this.memberModel
      .find({ memberId: userId })
      .select(['accId'])
      .populate('accId', ['accName', 'balance', 'owner']);

    return {
      Owner: acc,
      Member: memAcc,
    };
  }

  async getOne(accId: string, userId: string) {
    let isAcc = await this.accountModel
      .findOne({ _id: accId, owner: userId })
      .select(['accName', 'balance', 'owner'])
      .populate('owner', 'username email', this.userModel)
      .exec();

    if (isAcc) return isAcc;

    let isMem = await this.memberModel
      .findOne({
        accId: accId,
        memberId: userId,
      })
      .select(['accId'])
      .populate('accId', ['accName', 'balance', 'owner']);

    return isMem.accId;
  }

  async update(
    accId: string,
    updateAccountDto: UpdateAccountDto,
    userId: string,
  ) {
    const { oldName, newName } = updateAccountDto;
    let till12;

    let acc = await this.accountModel.findOne({
      accName: oldName,
      owner: userId,
    });
    till12 = { Error: 'No Account Found' };
    if (!acc) return till12;

    acc = await this.accountModel.findOne({
      accName: newName,
      owner: userId,
    });
    till12 = { Error: 'New account name is already in used' };
    if (acc) return till12;

    await this.accountModel.updateOne(
      { _id: acc.id, owner: userId },
      { accName: newName },
    );
    acc = await this.accountModel.findOne({ _id: acc.id, owner: userId });
    return acc;
  }

  async remove(accId: string, userId: string) {
    let acc = await this.accountModel.findOne({
      _id: accId,
      owner: userId,
    });
    await this.accountModel.deleteOne({
      _id: accId,
      owner: userId,
    });

    return acc;
  }
}
