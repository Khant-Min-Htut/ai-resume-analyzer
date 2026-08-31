import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';
import { isPdfMagicBytes, sanitizeText } from '../utils/sanitize';

@Injectable()
export class FileParserService {
  private readonly logger = new Logger(FileParserService.name);

  private readonly MAX_EXTRACTED_LENGTH = 200_000;

  async parseFile(file: Express.Multer.File): Promise<string> {
    const mimeType = file.mimetype;

    if (mimeType === 'application/pdf') {
      if (!isPdfMagicBytes(file.buffer)) {
        throw new BadRequestException(
          'File is not a valid PDF (bad magic bytes)',
        );
      }
      return this.parsePdf(file.buffer);
    } else if (
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return this.parseDocx(file.buffer);
    } else if (mimeType === 'text/plain') {
      const text = file.buffer.toString('utf-8');
      return this.sanitizeExtracted(text);
    } else {
      throw new BadRequestException(
        'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
      );
    }
  }

  private async parsePdf(buffer: Buffer): Promise<string> {
    try {
      const parser = new PDFParse(new Uint8Array(buffer));
      const result = await parser.getText();
      return this.sanitizeExtracted(result.text);
    } catch {
      this.logger.warn('PDF parsing failed');
      throw new BadRequestException('Failed to parse PDF file');
    }
  }

  private async parseDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return this.sanitizeExtracted(result.value);
    } catch {
      this.logger.warn('DOCX parsing failed');
      throw new BadRequestException('Failed to parse DOCX file');
    }
  }

  private sanitizeExtracted(text: string): string {
    const cleaned = sanitizeText(text);

    if (cleaned.length > this.MAX_EXTRACTED_LENGTH) {
      this.logger.warn(`Extracted text exceeds max length, truncating`);
      return cleaned.slice(0, this.MAX_EXTRACTED_LENGTH);
    }

    return cleaned;
  }
}
