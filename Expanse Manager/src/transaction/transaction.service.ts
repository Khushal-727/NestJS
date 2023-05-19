import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schema/transaction.schema';
import { Model } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    private readonly memberService: MemberService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    let trn,
      { accId } = createTransactionDto,
      trnAmt = parseFloat(String(createTransactionDto.amount)).toFixed(2);

    createTransactionDto.amount = Number(trnAmt);

    let isAcc = await this.accountModel.findOne({ _id: accId }),
      authTrn = await this.memberService.isMember(accId, userId);

    if (authTrn.Error) return authTrn;
    if (authTrn.Status == false) return { Error: 'Account not Found!' };

    if (!isAcc) return { Error: 'Invalid Account Id' };

    let newAmt;
    if (createTransactionDto.trnType == 'I') {
      newAmt = Number(isAcc.balance) + Number(createTransactionDto.amount);
    } else {
      newAmt = isAcc.balance - createTransactionDto.amount;
    }
    newAmt = newAmt.toFixed(2);

    if (newAmt < 0) {
      return { Error: 'Insufficient Balance' };
    }
    await this.accountModel.updateOne({ _id: accId }, { balance: newAmt });

    trn = await this.transactionModel.create(createTransactionDto);
    return trn;
  }

  async findAll(accId: string, userId: string) {
    let till12,
      authTrn = await this.memberService.isMember(accId, userId);

    if (authTrn.Error) return authTrn;

    let isAcc = await this.accountModel.findOne({
      _id: accId,
      owner: userId,
    });
    if (authTrn.Status == true) {
      isAcc = await this.accountModel.findOne({ _id: accId });
    }

    if (!isAcc) {
      till12 = { Error: 'Account Not Found!!' };
      return till12;
    }

    return this.transactionModel
      .find({ accId: accId })
      .select(['amount', 'trnType']);
  }

  async findOne(trnId: string) {
    return await this.transactionModel
      .findOne({ _id: trnId })
      .select(['amount', 'accId', 'trnType'])
      .exec();
  }

  async update(trnId: string, updateTransactionDto: UpdateTransactionDto) {
    let trnAmt = parseFloat(String(updateTransactionDto.amount)).toFixed(2);
    updateTransactionDto.amount = Number(trnAmt);
    const { amount } = updateTransactionDto;

    let till12,
      isTrn = await this.transactionModel.findById({ _id: trnId });

    if (!isTrn) {
      till12 = { Error: 'Transaction Not Found' };
      return till12;
    }

    let newBal,
      isAcc = await this.accountModel.findById({ _id: isTrn.accId });
    if (isTrn.trnType == 'I') {
      newBal = Number(amount) - Number(isTrn.amount);
    } else {
      newBal = Number(isTrn.amount) - Number(amount);
    }

    let newAmt = isAcc.balance + newBal;
    newAmt = newAmt.toFixed(2);
    if (newAmt < 0) return { Error: 'Insufficient Balance' };

    await this.accountModel.updateOne(
      { _id: isTrn.accId },
      { balance: newAmt },
    );
    await this.transactionModel.updateOne({ _id: trnId }, updateTransactionDto);

    let modifyTrn = await this.transactionModel.findById({ _id: trnId });

    return modifyTrn;
  }

  async remove(trnId: string) {
    let till12,
      isTrn = await this.transactionModel.findById(trnId);

    if (!isTrn) {
      till12 = { Error: 'Transaction Not Found!!' };
      return till12;
    }

    let newAmt,
      isAcc = await this.accountModel.findById({ _id: isTrn.accId });
    if (isTrn.trnType == 'I') {
      newAmt = Number(isAcc.balance) - Number(isTrn.amount);
    } else {
      newAmt = isAcc.balance + isTrn.amount;
    }

    newAmt = newAmt.toFixed(2);
    if (newAmt < 0) return { Error: 'Insufficient Balance' };

    await this.accountModel.updateOne(
      { _id: isTrn.accId },
      { balance: newAmt },
    );

    let delTrn = await this.transactionModel
      .findByIdAndDelete({ _id: trnId })
      .select(['amount', 'accId', 'trnType'])
      .exec();

    return delTrn;
  }
}
