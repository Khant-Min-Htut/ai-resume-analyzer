import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ResumeAnalysis,
  ResumeAnalysisDocument,
} from '../schemas/resume-analysis.schema';
import { ResumeService } from '../resume/resume.service';
import { JobDescriptionService } from '../job-description/job-description.service';
import { AiAnalysisService } from '../services/ai-analysis.service';

@Injectable()
export class ResumeAnalysisService {
  constructor(
    @InjectModel(ResumeAnalysis.name)
    private resumeAnalysisModel: Model<ResumeAnalysisDocument>,
    private readonly resumeService: ResumeService,
    private readonly jobDescriptionService: JobDescriptionService,
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  async analyze(userId: string, resumeId: string, jobDescriptionId: string) {
    const resume = await this.resumeService.getResumeById(resumeId, userId);

    const jobDescription = await this.jobDescriptionService.findById(
      jobDescriptionId,
      userId,
    );
    const jobDescriptionText = jobDescription.description;

    const analysisResult = await this.aiAnalysisService.analyzeResume(
      resume.extractedText,
      jobDescriptionText,
    );

    const resumeAnalysis = new this.resumeAnalysisModel({
      userId: new Types.ObjectId(userId),
      resumeId: new Types.ObjectId(resumeId),
      jobDescriptionId: new Types.ObjectId(jobDescriptionId),
      overallScore: analysisResult.overallScore,
      atsScore: analysisResult.atsScore,
      jobMatchScore: analysisResult.jobMatchScore,
      summary: analysisResult.summary,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      skills: analysisResult.skills,
      missingSkills: analysisResult.missingSkills,
      matchedKeywords: analysisResult.matchedKeywords,
      missingKeywords: analysisResult.missingKeywords,
      recommendations: analysisResult.recommendations,
      sectionFeedback: analysisResult.sectionFeedback,
    });

    await resumeAnalysis.save();

    return {
      id: resumeAnalysis._id.toString(),
      userId: resumeAnalysis.userId.toString(),
      resumeId: resumeAnalysis.resumeId.toString(),
      jobDescriptionId: resumeAnalysis.jobDescriptionId.toString(),
      overallScore: resumeAnalysis.overallScore,
      atsScore: resumeAnalysis.atsScore,
      jobMatchScore: resumeAnalysis.jobMatchScore,
      summary: resumeAnalysis.summary,
      strengths: resumeAnalysis.strengths,
      weaknesses: resumeAnalysis.weaknesses,
      skills: resumeAnalysis.skills,
      missingSkills: resumeAnalysis.missingSkills,
      matchedKeywords: resumeAnalysis.matchedKeywords,
      missingKeywords: resumeAnalysis.missingKeywords,
      recommendations: resumeAnalysis.recommendations,
      sectionFeedback: resumeAnalysis.sectionFeedback,
      createdAt: (resumeAnalysis as unknown as { createdAt: string }).createdAt,
    };
  }

  async findById(id: string, userId?: string) {
    const analysis = await this.resumeAnalysisModel
      .findById(id)
      .populate('resumeId', 'fileName')
      .populate('jobDescriptionId', 'title company');
    if (!analysis) {
      throw new NotFoundException('Resume analysis not found');
    }
    if (userId && analysis.userId.toString() !== userId) {
      throw new ForbiddenException('You can only access your own analyses');
    }
    return analysis;
  }

  async findByResumeId(resumeId: string) {
    return this.resumeAnalysisModel
      .find({ resumeId: new Types.ObjectId(resumeId) })
      .populate('resumeId', 'fileName')
      .populate('jobDescriptionId', 'title company')
      .sort({ createdAt: -1 });
  }

  async findByUserId(userId: string) {
    return this.resumeAnalysisModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('resumeId', 'fileName')
      .populate('jobDescriptionId', 'title company')
      .sort({ createdAt: -1 });
  }
}
