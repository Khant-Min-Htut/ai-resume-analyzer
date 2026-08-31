import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AiAnalysisService } from '../services/ai-analysis.service';
import { AnalyzeResumeDto } from '../dto/analyze-resume.dto';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Post('analyze')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async analyzeResume(@Body() analyzeResumeDto: AnalyzeResumeDto) {
    const analysisResult = await this.aiAnalysisService.analyzeResume(
      analyzeResumeDto.resumeText,
      analyzeResumeDto.jobDescription,
    );
    return analysisResult;
  }
}
