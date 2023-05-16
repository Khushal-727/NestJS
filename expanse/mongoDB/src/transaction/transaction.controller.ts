import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
@UsePipes(ValidationPipe)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() res,
  ) {
    let { userId } = req.userData;

    let trn = await this.transactionService.create(
      createTransactionDto,
      userId,
    );
    if (trn.Error) {
      return res.json({
        Error: trn.Error,
      });
    }
    res.json({
      Message: 'Transaction Created',
      Transaction: trn,
    });
  }

  @Get()
  async findAll(@Req() req, @Body() { accId }, @Res() res) {
    let { userId } = req.userData;
    let trn = await this.transactionService.findAll(accId, userId);

    if (trn.Error) {
      return res.json({
        Error: trn.Error,
      });
    }

    if (!trn[0]) {
      return res.json({
        Message: 'No Transaction!! List is Empty',
        AccId: accId,
        UserId: userId,
      });
    }

    res.json({
      Message: 'List of Transaction',
      AccId: accId,
      UserId: userId,
      Count: trn.length,
      Transaction: trn,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    let trn = await this.transactionService.findOne(id);
    if (!trn) {
      return res.json({
        Message: 'No Transaction Detail',
        TransactionID: id,
      });
    }
    res.json({
      Message: 'Transaction Detail',
      Transaction: trn,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') trnId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Res() res,
  ) {
    let trn = await this.transactionService.update(trnId, updateTransactionDto);

    if (trn.Error) {
      return res.json({
        Error: trn.Error,
      });
    }

    return res.json({
      Message: 'Transaction detail',
      Transaction: trn,
    });
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') trnId: string) {
    let trn = await this.transactionService.remove(trnId);
    if (trn.Error) {
      return res.json({
        Error: trn.Error,
      });
    }
    res.json({
      Message: 'Transaction Deleted',
      TransactionID: trn,
    });
  }
}
