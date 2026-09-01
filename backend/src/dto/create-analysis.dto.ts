import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateAnalysisDto {
  @IsMongoId()
  @IsNotEmpty()
  resumeId: string;

  @IsMongoId()
  @IsNotEmpty()
  jobDescriptionId: string;
}
