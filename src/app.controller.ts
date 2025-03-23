import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FileMetadata, PresignedFileRequestDto } from './dto/file-upload.dto';

@Controller('files')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/presigned')
  getPresignedUploadUrl(
    @Body() { fileName, fileSize, mimeType }: PresignedFileRequestDto,
  ) {
    return this.appService.getUploadPresignedUrl(fileName, mimeType, fileSize);
  }

  @Post('/:fileId/save')
  async saveFilePostUpload(
    @Body() fileMetadata: FileMetadata,
    @Param('fileId') fileId: string,
  ) {
    await this.appService.saveFile(fileId, fileMetadata);
    return;
  }
}
