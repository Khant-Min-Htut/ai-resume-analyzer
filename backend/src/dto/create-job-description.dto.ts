import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateJobDescriptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  company: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  description: string;
}
