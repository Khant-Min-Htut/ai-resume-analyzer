import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateAnalysisDto {
  @IsMongoId()
  @IsNotEmpty()
  resumeId: string;

  @IsOptional()
  @IsMongoId()
  jobDescriptionId?: string;
}
