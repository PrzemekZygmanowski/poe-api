import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { OperationDTO } from './OperationDTO';
import { type } from './OperationQuery';

@Controller('operations')
export class OperationsController {
  @Post('')
  askPoe(@Body() operationQuery: OperationDTO) {
    if (operationQuery.type !== 'save' || 'query' || 'forget' || 'remember') {
      throw new HttpException('Type should be: ', 404);
    }
    return operationQuery;
  }
}
