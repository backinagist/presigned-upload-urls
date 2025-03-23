import { BadRequestException, Injectable } from '@nestjs/common';
import { FileMetadata } from './dto/file-upload.dto';
import { AwsS3Service } from './service/aws-s3.service';
import { FileService } from './service/file.service';

@Injectable()
export class AppService {
  private readonly allowedMimeTypes = new Set(['image/png', 'image/jpg']);
  private readonly maxFileSizeBytes = 1000000;

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly fileService: FileService,
  ) {}

  async getUploadPresignedUrl(
    filename: string,
    mimeType: string,
    fileSize: number,
  ): Promise<{ id: string; url: string }> {
    if (
      !this.allowedMimeTypes.has(mimeType) ||
      fileSize >= this.maxFileSizeBytes
    ) {
      throw new BadRequestException('Validation failed for file upload');
    }

    const { id } = await this.fileService.createNewFile(
      filename,
      mimeType,
      fileSize,
    );
    const key = `files/${filename}`;

    const url = await this.awsS3Service.getUploadPresignedUrl(
      key,
      mimeType,
      fileSize,
    );

    return { id, url };
  }

  async saveFile(fileId: string, fileMetadata: FileMetadata): Promise<void> {
    const file = await this.fileService.getFileById(fileId);

    if (file.isUploaded) {
      throw new BadRequestException('file already uploaded');
    }

    await this.fileService.markFileUploaded(fileId, fileMetadata);
  }
}
