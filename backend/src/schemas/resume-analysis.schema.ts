import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResumeAnalysisDocument = ResumeAnalysis & Document;

@Schema({ timestamps: true })
export class ResumeAnalysis {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Resume', required: true, index: true })
  resumeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'JobDescription', required: true, index: true })
  jobDescriptionId: Types.ObjectId;

  @Prop({ required: true, min: 0, max: 100 })
  overallScore: number;

  @Prop({ required: true, min: 0, max: 100 })
  atsScore: number;

  @Prop({ min: 0, max: 100 })
  jobMatchScore?: number;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  strengths: string[];

  @Prop({ type: [String], required: true })
  weaknesses: string[];

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ type: [String], required: true })
  missingSkills: string[];

  @Prop({ type: [String], required: true })
  matchedKeywords: string[];

  @Prop({ type: [String], required: true })
  missingKeywords: string[];

  @Prop({ type: [String], required: true })
  recommendations: string[];

  @Prop({
    type: {
      summary: { type: String },
      experience: { type: String },
      education: { type: String },
      skills: { type: String },
      format: { type: String },
    },
  })
  sectionFeedback?: {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    format?: string;
  };
}

export const ResumeAnalysisSchema =
  SchemaFactory.createForClass(ResumeAnalysis);

// Ensure `id` is always present and `_id` is removed on JSON output
ResumeAnalysisSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(_doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Indexes
ResumeAnalysisSchema.index({ userId: 1, createdAt: -1 });
ResumeAnalysisSchema.index({ resumeId: 1, createdAt: -1 });
ResumeAnalysisSchema.index({ jobDescriptionId: 1, createdAt: -1 });
ResumeAnalysisSchema.index({ overallScore: -1 });
ResumeAnalysisSchema.index({ createdAt: -1 });
