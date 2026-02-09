import { Storage } from '@google-cloud/storage';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';

interface UploadedFileInfo {
  id: string;
  url: string;
  name: string;
  size: number;
  bucketPath: string;
  signedUrl: string;
  signedUrlExpiry: Date;
}

class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    // In Cloud Run (production), use Application Default Credentials
    // In local development, use service account key file
    if (process.env.NODE_ENV === 'production') {
      console.log('🔧 Initializing GCS with Application Default Credentials (Cloud Run)');
      this.storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
      });
    } else {
      console.log('🔧 Initializing GCS with service account key file (local dev)');
      const keyFilePath = process.env.GCP_SERVICE_ACCOUNT_KEY;
      
      if (!keyFilePath) {
        throw new Error('GCP_SERVICE_ACCOUNT_KEY environment variable is not set for local development');
      }

      // Resolve the path relative to the backend directory
      const absolutePath = path.resolve(process.cwd(), keyFilePath);
      
      this.storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: absolutePath,
      });
    }

    this.bucketName = process.env.GCP_BUCKET_NAME || 'dc3-storage';
    console.log(`✅ GCS initialized. Bucket: ${this.bucketName}`);
  }

  /**
   * Upload a file to Google Cloud Storage
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<UploadedFileInfo> {
    try {
      const fileId = uuidV4();
      const fileExtension = path.extname(file.originalname);
      const fileName = `${fileId}${fileExtension}`;
      const bucketPath = `uploads/${userId}/${fileName}`;

      const bucket = this.storage.bucket(this.bucketName);
      const blob = bucket.file(bucketPath);

      // Upload file
      await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            userId: userId,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      // Generate signed URL (valid for 7 days)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      const [signedUrl] = await blob.getSignedUrl({
        action: 'read',
        expires: expiryDate,
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${bucketPath}`;

      return {
        id: fileId,
        url: publicUrl,
        name: file.originalname,
        size: file.size,
        bucketPath,
        signedUrl,
        signedUrlExpiry: expiryDate,
      };
    } catch (error) {
      console.error('Error uploading file to GCS:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId: string
  ): Promise<UploadedFileInfo[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, userId));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Google Cloud Storage
   */
  async deleteFile(bucketPath: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      await bucket.file(bucketPath).delete();
    } catch (error) {
      console.error('Error deleting file from GCS:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  /**
   * Generate a new signed URL for an existing file
   */
  async regenerateSignedUrl(
    bucketPath: string,
    expiryDays: number = 7
  ): Promise<{ signedUrl: string; signedUrlExpiry: Date }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const blob = bucket.file(bucketPath);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      const [signedUrl] = await blob.getSignedUrl({
        action: 'read',
        expires: expiryDate,
      });

      return {
        signedUrl,
        signedUrlExpiry: expiryDate,
      };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(bucketPath: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [exists] = await bucket.file(bucketPath).exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();