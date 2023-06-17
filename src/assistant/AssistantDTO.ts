import { IsString, IsObject } from 'class-validator';
import { Category, Type } from './interface';

class chatParamsDTO {
  @IsString()
  model;
}

export class AssistantDTO {
  @IsString()
  query: string;

  @IsString()
  type: Type;

  @IsString()
  category: Category;

  @IsString()
  context;

  @IsObject()
  chatParams: chatParamsDTO;
}
