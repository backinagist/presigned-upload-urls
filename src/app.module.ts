import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsS3Service } from './service/aws-s3.service';
import { FileService } from './service/file.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AwsS3Service, FileService],
})
export class AppModule {}
