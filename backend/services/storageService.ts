import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

interface UploadedFileInfo {
  id: string;
  url: string;
  name: string;
  size: number;
  bucketPath: string;
  signedUrl: string;
  signedUrlExpiry: Date;
}

interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.GCP_BUCKET_NAME || 'dc3';
    this.storage = this.initializeStorage();
    console.log(`📦 Storage initialized with bucket: ${this.bucketName}`);
  }

  /**
   * Initialize Google Cloud Storage with credentials from gcp.json
   */
  private initializeStorage(): Storage {
    const keyFilename = './gcp.json';

    // Check if gcp.json exists
    if (!fs.existsSync(keyFilename)) {
      throw new Error(
        `❌ GCP credentials file not found: ${keyFilename}\n` +
        `Please ensure gcp.json is in the backend root directory.`
      );
    }

    try {
      // Read and validate the JSON file
      const credentialsContent = fs.readFileSync(keyFilename, 'utf8');
      const credentials = JSON.parse(credentialsContent) as ServiceAccountKey;
      
      this.validateServiceAccountKey(credentials);

      console.log(`✅ Using GCP credentials from file: ${keyFilename}`);
      console.log(`📧 Service account: ${credentials.client_email}`);
      console.log(`🆔 Project ID: ${credentials.project_id}`);

      return new Storage({
        projectId: credentials.project_id,
        keyFilename,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `❌ Invalid JSON in ${keyFilename}. Please check the file format.`
        );
      }
      throw error;
    }
  }

  /**
   * Validate service account key structure
   */
  private validateServiceAccountKey(credentials: any): asserts credentials is ServiceAccountKey {
    if (!credentials || typeof credentials !== 'object') {
      throw new Error('❌ GCP service account key must be a valid JSON object');
    }

    if (credentials.type !== 'service_account') {
      throw new Error(
        `❌ Invalid service account type. Expected 'service_account', got '${credentials.type}'`
      );
    }

    const requiredFields: (keyof ServiceAccountKey)[] = [
      'client_email',
      'private_key',
      'project_id',
    ];

    const missingFields = requiredFields.filter(field => !credentials[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `❌ GCP service account key is missing required fields: ${missingFields.join(', ')}`
      );
    }

    if (!credentials.private_key.includes('BEGIN PRIVATE KEY')) {
      throw new Error('❌ GCP service account private_key is malformed');
    }
  }

  /**
   * Upload a single file to Google Cloud Storage
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<UploadedFileInfo> {
    try {
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const fileName = `${fileId}${fileExtension}`;
      const bucketPath = `uploads/${userId}/${fileName}`;

      console.log(`📤 Uploading file: ${file.originalname} (${file.size} bytes)`);

      const bucket = this.storage.bucket(this.bucketName);
      const blob = bucket.file(bucketPath);

      // Upload file with metadata
      await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            userId,
            uploadedAt: new Date().toISOString(),
            fileSize: file.size.toString(),
          },
        },
        resumable: file.size > 5 * 1024 * 1024, // Resumable for files > 5MB
      });

      console.log(`✅ File uploaded successfully: ${bucketPath}`);

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
      console.error('❌ Error uploading file to GCS:', error);

      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('invalid_grant')) {
          throw new Error(
            '❌ Authentication failed: Your GCP service account credentials are invalid or expired.\n' +
            'Solution: Download a new JSON key from Google Cloud Console and replace gcp.json'
          );
        }
        if (error.message.includes('Account has been deleted')) {
          throw new Error(
            '❌ Service account has been deleted in Google Cloud.\n' +
            'Solution: Create a new service account, download the JSON key, and replace gcp.json'
          );
        }
        if (error.message.includes('Permission denied') || error.message.includes('403')) {
          throw new Error(
            '❌ Permission denied: Service account does not have access to the bucket.\n' +
            'Solution: Go to Google Cloud Console → IAM & Admin → Grant "Storage Admin" role to your service account'
          );
        }
        if (error.message.includes('Bucket') && error.message.includes('not found')) {
          throw new Error(
            `❌ Bucket '${this.bucketName}' does not exist.\n` +
            'Solution: Create the bucket in Google Cloud Console or update GCP_BUCKET_NAME in .env'
          );
        }
      }

      throw new Error(
        `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Upload multiple files concurrently
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId: string
  ): Promise<UploadedFileInfo[]> {
    if (!files || files.length === 0) {
      console.log('⚠️  No files to upload');
      return [];
    }

    console.log(`📤 Uploading ${files.length} file(s)...`);

    const uploadPromises = files.map((file) => this.uploadFile(file, userId));
    const results = await Promise.all(uploadPromises);

    console.log(`✅ Successfully uploaded ${results.length} file(s)`);
    return results;
  }

  /**
   * Delete a file from Google Cloud Storage
   */
  async deleteFile(bucketPath: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      await bucket.file(bucketPath).delete();
      console.log(`🗑️  Deleted file: ${bucketPath}`);
    } catch (error) {
      console.error('❌ Error deleting file from GCS:', error);
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(bucketPaths: string[]): Promise<void> {
    if (!bucketPaths || bucketPaths.length === 0) {
      return;
    }

    console.log(`🗑️  Deleting ${bucketPaths.length} file(s)...`);
    const deletePromises = bucketPaths.map((path) => this.deleteFile(path));
    await Promise.all(deletePromises);
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

      // Check if file exists
      const [exists] = await blob.exists();
      if (!exists) {
        throw new Error(`File not found: ${bucketPath}`);
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      const [signedUrl] = await blob.getSignedUrl({
        action: 'read',
        expires: expiryDate,
      });

      console.log(`🔗 Generated signed URL for: ${bucketPath}`);

      return {
        signedUrl,
        signedUrlExpiry: expiryDate,
      };
    } catch (error) {
      console.error('❌ Error generating signed URL:', error);
      throw new Error(
        `Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if a file exists in the bucket
   */
  async fileExists(bucketPath: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [exists] = await bucket.file(bucketPath).exists();
      return exists;
    } catch (error) {
      console.error('❌ Error checking file existence:', error);
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(bucketPath: string): Promise<any> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [metadata] = await bucket.file(bucketPath).getMetadata();
      return metadata;
    } catch (error) {
      console.error('❌ Error getting file metadata:', error);
      throw new Error(
        `Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * List all files for a user
   */
  async listUserFiles(userId: string): Promise<string[]> {
    try {
      const prefix = `uploads/${userId}/`;
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({ prefix });
      return files.map((file) => file.name);
    } catch (error) {
      console.error('❌ Error listing files:', error);
      throw new Error(
        `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get bucket information
   */
  async getBucketInfo(): Promise<any> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [metadata] = await bucket.getMetadata();
      return metadata;
    } catch (error) {
      console.error('❌ Error getting bucket info:', error);
      throw new Error(
        `Failed to get bucket info: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export class for testing
export { StorageService };