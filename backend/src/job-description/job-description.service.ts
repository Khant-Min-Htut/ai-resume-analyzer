import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  JobDescription,
  JobDescriptionDocument,
} from '../schemas/job-description.schema';
import { sanitizeAndTruncate } from '../utils/sanitize';

@Injectable()
export class JobDescriptionService {
  private readonly MAX_TITLE_LENGTH = 200;
  private readonly MAX_COMPANY_LENGTH = 200;
  private readonly MAX_DESCRIPTION_LENGTH = 10000;

  constructor(
    @InjectModel(JobDescription.name)
    private jobDescriptionModel: Model<JobDescriptionDocument>,
  ) {}

  async create(
    createJobDescriptionDto: {
      title: string;
      company: string;
      description: string;
    },
    userId: string,
  ) {
    const title = sanitizeAndTruncate(
      createJobDescriptionDto.title,
      this.MAX_TITLE_LENGTH,
    );
    const company = sanitizeAndTruncate(
      createJobDescriptionDto.company,
      this.MAX_COMPANY_LENGTH,
    );
    const description = sanitizeAndTruncate(
      createJobDescriptionDto.description,
      this.MAX_DESCRIPTION_LENGTH,
    );

    if (!title.trim() || !company.trim() || !description.trim()) {
      throw new BadRequestException(
        'Title, company, and description are required',
      );
    }

    const jobDescription = new this.jobDescriptionModel({
      userId: new Types.ObjectId(userId),
      title,
      company,
      description,
    });

    await jobDescription.save();

    return {
      id: jobDescription._id.toString(),
      userId: jobDescription.userId.toString(),
      title: jobDescription.title,
      company: jobDescription.company,
      createdAt: (jobDescription as unknown as { createdAt: string }).createdAt,
    };
  }

  async findById(id: string, userId?: string) {
    const jobDescription = await this.jobDescriptionModel.findById(id);
    if (!jobDescription) {
      throw new NotFoundException('Job description not found');
    }
    if (userId && jobDescription.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You can only access your own job descriptions',
      );
    }
    return jobDescription;
  }

  async findByUserId(userId: string) {
    return this.jobDescriptionModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('-description')
      .sort({ createdAt: -1 });
  }
}
