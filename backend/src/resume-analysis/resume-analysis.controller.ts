import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ResumeAnalysisService } from './resume-analysis.service';
import { CreateAnalysisDto } from '../dto/create-analysis.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/analyses')
export class ResumeAnalysisController {
  constructor(private readonly resumeAnalysisService: ResumeAnalysisService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.resumeAnalysisService.analyze(
      user.sub,
      createAnalysisDto.resumeId,
      createAnalysisDto.jobDescriptionId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.resumeAnalysisService.findById(id, user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: { sub: string }) {
    return this.resumeAnalysisService.findByUserId(user.sub);
  }
}
