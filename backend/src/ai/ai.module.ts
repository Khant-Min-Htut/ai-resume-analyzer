import { Module } from '@nestjs/common';
import { AiAnalysisService } from '../services/ai-analysis.service';
import { AiController } from './ai.controller';

@Module({
  providers: [AiAnalysisService],
  controllers: [AiController],
  exports: [AiAnalysisService],
})
export class AiModule {}
