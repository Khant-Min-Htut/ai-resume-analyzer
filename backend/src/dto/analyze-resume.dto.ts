import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class AnalyzeResumeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15000)
  resumeText: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  jobDescription?: string;

  @IsOptional()
  @IsString()
  resumeId?: string;

  @IsOptional()
  @IsString()
  jobDescriptionId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
