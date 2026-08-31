import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

import { isPdfMagicBytes } from '../utils/sanitize';

@Controller('api/resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1,
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        if (
          file.originalname.includes('\0') ||
          file.originalname.length > 255
        ) {
          return callback(new BadRequestException('Invalid file name'), false);
        }
        callback(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { sub: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!isPdfMagicBytes(file.buffer)) {
      throw new BadRequestException('Uploaded file is not a valid PDF');
    }

    return this.resumeService.uploadResume(file, user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getResume(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.resumeService.getResumeById(id, user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllResumes(@CurrentUser() user: { sub: string }) {
    return this.resumeService.getResumesByUserId(user.sub);
  }
}
