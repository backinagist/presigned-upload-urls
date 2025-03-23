export interface FileMetadata {
  id: string;
  title: number;
  fileId: string;
}

export interface PresignedFileRequestDto {
  fileName: string;
  fileSize: number;
  mimeType: string;
}
