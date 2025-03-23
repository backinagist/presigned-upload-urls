import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly expiresInSeconds: number;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client();
    this.bucket = configService
      .get<string>('AWS_S3_BUCKET', 'default-bucket');
    this.expiresInSeconds = configService
      .get<number>('AWS_S3_OBJECT_EXPIRY_SECOND', 360);
  }

  public async getUploadPresignedUrl(key: string, mimeType: string, fileSize: number): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
      ContentLength: fileSize,
    };

    return await getSignedUrl(
      this.client,
      new PutObjectCommand(params),
      { expiresIn: this.expiresInSeconds }
    );
  }
}
