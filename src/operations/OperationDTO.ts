import { IsString } from 'class-validator';
import { category, type } from './OperationQuery';

export class OperationDTO {
  @IsString()
  query: string;

  @IsString()
  type: type;

  @IsString()
  category: category;
}
