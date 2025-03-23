import { v4 as uuidv4 } from 'uuid';
import { FileMetadata } from '../dto/file-upload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  private readonly fileStorage = new Map();
  private readonly fileMetadataStorage = new Map();

  async createNewFile(
    filename: string,
    mimeType: string,
    fileSize: number,
  ): Promise<any> {
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

  async markFileUploaded(fileId: string, fileMetadata: FileMetadata) {
    const file = this.fileStorage.get(fileId);
    file.isUploaded = true;

    const { title } = fileMetadata;

    const fileMetadataEntity = {
      id: uuidv4(),
      fileId,
      title,
    };

    this.fileMetadataStorage.set(fileMetadataEntity.id, fileMetadata);
  }
}
