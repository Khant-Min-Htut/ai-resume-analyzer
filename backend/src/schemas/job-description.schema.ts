import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDescriptionDocument = JobDescription & Document;

@Schema({ timestamps: true })
export class JobDescription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  company: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'ResumeAnalysis' })
  analyses: Types.ObjectId[];
}

export const JobDescriptionSchema =
  SchemaFactory.createForClass(JobDescription);

JobDescriptionSchema.set('toJSON', {
  transform(_doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

JobDescriptionSchema.index({ userId: 1, createdAt: -1 });
JobDescriptionSchema.index({ company: 1, createdAt: -1 });
JobDescriptionSchema.index({ createdAt: -1 });
