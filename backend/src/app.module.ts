import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { JobDescriptionModule } from './job-description/job-description.module';
import { ResumeAnalysisModule } from './resume-analysis/resume-analysis.module';
import { User, UserSchema } from './schemas/user.schema';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import {
  JobDescription,
  JobDescriptionSchema,
} from './schemas/job-description.schema';
import {
  ResumeAnalysis,
  ResumeAnalysisSchema,
} from './schemas/resume-analysis.schema';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 120,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-analyzer',
      {
        serverSelectionTimeoutMS: 3000,
        heartbeatFrequencyMS: 10000,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      },
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: JobDescription.name, schema: JobDescriptionSchema },
      { name: ResumeAnalysis.name, schema: ResumeAnalysisSchema },
    ]),
    AuthModule,
    ResumeModule,
    JobDescriptionModule,
    ResumeAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
