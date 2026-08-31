import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resume, ResumeDocument } from '../schemas/resume.schema';
import { FileParserService } from '../services/file-parser.service';
import { sanitizeText } from '../utils/sanitize';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
    private readonly fileParserService: FileParserService,
  ) {}

  async uploadResume(file: Express.Multer.File, userId: string) {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are currently supported');
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    if (file.size === 0) {
      throw new BadRequestException('Uploaded file is empty');
    }

    let extractedText: string;
    try {
      extractedText = await this.fileParserService.parseFile(file);
    } catch {
      throw new BadRequestException('Failed to extract text from PDF file');
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new BadRequestException(
        'No text could be extracted from the PDF file',
      );
    }

    const safeFileName = sanitizeText(file.originalname)
      .replace(/[^\w\s.\-()]/g, '_')
      .slice(0, 200);

    const resume = new this.resumeModel({
      userId: new Types.ObjectId(userId),
      fileName: safeFileName,
      extractedText,
      fileMetadata: {
        fileType: 'pdf',
        fileSize: file.size,
        mimeType: file.mimetype,
        originalName: safeFileName,
      },
    });

    await resume.save();

    return {
      id: resume._id.toString(),
      userId: resume.userId.toString(),
      fileName: resume.fileName,
      fileMetadata: resume.fileMetadata,
      createdAt: (resume as unknown as { createdAt: string }).createdAt,
    };
  }

  async getResumeById(id: string, userId?: string) {
    const resume = await this.resumeModel.findById(id);
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    if (userId && resume.userId.toString() !== userId) {
      throw new ForbiddenException('You can only access your own resumes');
    }
    return resume;
  }

  async getResumesByUserId(userId: string) {
    return this.resumeModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('-extractedText')
      .sort({ createdAt: -1 });
  }
}
