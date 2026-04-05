import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: diskStorage({
          destination: config.get<string>('UPLOAD_DIR', './uploads'),
          filename: (req, file, cb) => {
            const uniqueName = `${uuid()}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
        limits: {
          fileSize: config.get<number>('MAX_FILE_SIZE', 5242880),
        },
        fileFilter: (req: any, file: any, cb: any) => {
          const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
          if (allowed.test(extname(file.originalname))) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed'), false);
          }
        },
      }),
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
