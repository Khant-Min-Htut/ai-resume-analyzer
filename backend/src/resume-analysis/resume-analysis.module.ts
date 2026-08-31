import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeAnalysisController } from './resume-analysis.controller';
import { ResumeAnalysisService } from './resume-analysis.service';
import {
  ResumeAnalysis,
  ResumeAnalysisSchema,
} from '../schemas/resume-analysis.schema';
import { AiModule } from '../ai/ai.module';
import { ResumeModule } from '../resume/resume.module';
import { JobDescriptionModule } from '../job-description/job-description.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResumeAnalysis.name, schema: ResumeAnalysisSchema },
    ]),
    AiModule,
    ResumeModule,
    JobDescriptionModule,
  ],
  controllers: [ResumeAnalysisController],
  providers: [ResumeAnalysisService],
  exports: [ResumeAnalysisService],
})
export class ResumeAnalysisModule {}
