import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }
}
