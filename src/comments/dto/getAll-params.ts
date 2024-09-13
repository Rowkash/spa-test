import { Type } from 'class-transformer';
import { IsIn, IsOptional, Min } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetAllParams {
  @IsOptional()
  @IsIn(['name', 'email', 'date'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['DESC', 'ASC'])
  order?: Order;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;
}
