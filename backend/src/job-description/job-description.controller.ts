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
import { JobDescriptionService } from './job-description.service';
import { CreateJobDescriptionDto } from '../dto/create-job-description.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/job-descriptions')
export class JobDescriptionController {
  constructor(private readonly jobDescriptionService: JobDescriptionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createJobDescriptionDto: CreateJobDescriptionDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.jobDescriptionService.create(createJobDescriptionDto, user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.jobDescriptionService.findById(id, user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: { sub: string }) {
    return this.jobDescriptionService.findByUserId(user.sub);
  }
}
