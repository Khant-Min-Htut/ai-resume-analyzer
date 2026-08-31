import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResumeDocument = Resume & Document;

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  extractedText: string;

  @Prop({
    type: {
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      mimeType: { type: String, required: true },
      originalName: { type: String, required: true },
    },
    required: true,
  })
  fileMetadata: {
    fileType: string;
    fileSize: number;
    mimeType: string;
    originalName: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'ResumeAnalysis' })
  analyses: Types.ObjectId[];
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

// Ensure `id` is always present and `_id` is removed on JSON output
ResumeSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(_doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Indexes
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ createdAt: -1 });
