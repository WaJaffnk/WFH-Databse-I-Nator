
import * as Minio from 'minio';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const MINIO_ROOT_USER = process.env.MINIO_ROOT_USER || 'wajaffnk';
const MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD || 'wajaffnk';
const MINIO_DEFAULT_BUCKET = process.env.MINIO_DEFAULT_BUCKET || 'wfhinator-bucket';

console.log('Loaded ENV:', {
  MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD,
  MINIO_DEFAULT_BUCKET
});

const policy = `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetBucketLocation",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::${MINIO_DEFAULT_BUCKET}"
      ],
      "Sid": ""
    },
    {
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::${MINIO_DEFAULT_BUCKET}/*"
      ],
      "Sid": ""
    }
  ]
}
`

console.log('Set bucket policy')

async function connect() {
  try {
    // Create a MinIO client instance
    const minioClient = new Minio.Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false, // Local MinIO usually does not use SSL
      accessKey: MINIO_ROOT_USER,
      secretKey: MINIO_ROOT_PASSWORD
    });
    console.log('Checking if bucket exists:', MINIO_DEFAULT_BUCKET);
    const exists = await minioClient.bucketExists(MINIO_DEFAULT_BUCKET);
    if (!exists) {
      console.log('Bucket does not exist. Creating...');
      await minioClient.makeBucket(MINIO_DEFAULT_BUCKET, 'us-east-1');
      console.log(`Bucket ${MINIO_DEFAULT_BUCKET} created successfully`);
    } else {
      console.log(`Bucket ${MINIO_DEFAULT_BUCKET} already exists`);
    }

    console.log('Setting bucket policy');
    await minioClient.setBucketPolicy(MINIO_DEFAULT_BUCKET, policy)
    console.log(`Bucket policy set for ${MINIO_DEFAULT_BUCKET}`);
  } catch (error) {
    console.error('Error connecting to MinIO:', error);
    process.exit(1);
  }
}

connect().then(() => {
  console.log('MinIO setup complete.');
  process.exit(0);
});