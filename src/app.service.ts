import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsS3Service } from './service/aws-s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly allowedMimeTypes = new Set(['image/png', 'image/jpg']);
  private readonly maxFileSizeBytes = 1000000;

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly fileService: FileService,
  ) {}

  async getUploadPresignedUrl(filename: string, mimeType: string, fileSize: number): Promise<{ id: string; url: string }> {
    if (!this.allowedMimeTypes.has(mimeType) || fileSize >= this.maxFileSizeBytes) {
      throw new BadRequestException('Validation failed for file upload');
    }

    const { id } = await this.fileService.createNewFile(filename, mimeType, fileSize);
    const key = `files/${filename}`;

    const url = await this.awsS3Service.getUploadPresignedUrl(key, mimeType, fileSize);

    return { id, url };
  }

  async saveFile(fileId: number, fileMetadata: FileMetadata): Promise<void> {
    const file = await this.fileService.getFileById(fileId);

    if (file.isUploaded) {
      throw new BadRequestException('file already uploaded');
    }

    await this.fileService.markFileUploaded(fileId, fileMetadata);
  }
}

interface FileMetadata {
  id: string;
  title: number;
  fileId: string;
}

class FileService {
  private readonly fileStorage = new Map();
  private readonly fileMetadataStorage = new Map();

  async createNewFile(filename: string, mimeType: string, fileSize: number): Promise<any> {
    const fileEntity = {
      id: uuidv4(),
      isUploaded: false,
      filename,
      mimeType,
      fileSize,
    };

    this.fileStorage.set(fileEntity.id, fileEntity);

    return fileEntity;
  }

  async getFileById(fileId: string) {
    return this.fileStorage.get(fileId);
  }

  async markFileUploaded(fileId: number, fileMetadata: FileMetadata) {
    const file = this.fileStorage.get(fileId);
    file.isUploaded = true;

    const { title } = fileMetadata;

    const fileMetadataEntity = {
      id: uuidv4(),
      fileId,
      title
    };

    this.fileMetadataStorage.set(fileMetadataEntity.id, fileMetadata);
  }
}
