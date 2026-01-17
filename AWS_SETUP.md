# AWS S3 Setup Guide

This guide will help you connect your AccessiBooks application to Amazon S3 for file storage.

## Prerequisites

1. An AWS account (create one at [aws.amazon.com](https://aws.amazon.com))
2. AWS Console access

## Step 1: Create an S3 Bucket

1. Log in to the [AWS Console](https://console.aws.amazon.com)
2. Navigate to **S3** service
3. Click **Create bucket**
4. Configure your bucket:
   - **Bucket name**: Choose a unique name (e.g., `accessibooks-media`)
   - **AWS Region**: Select your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: Configure based on your needs
     - If you want public URLs: Uncheck "Block all public access" and enable ACLs
     - For private files only: Keep public access blocked
   - **Bucket Versioning**: Optional (disable for cost savings)
   - **Default encryption**: Enable (recommended)
5. Click **Create bucket**

## Step 2: Create IAM User and Access Keys

1. Navigate to **IAM** service in AWS Console
2. Click **Users** in the left sidebar
3. Click **Create user**
4. Enter a username (e.g., `accessibooks-s3-user`)
5. Click **Next**
6. Select **Attach policies directly**
7. Search for and select **AmazonS3FullAccess** (or create a custom policy with only necessary permissions)
8. Click **Next** → **Create user**

## Step 3: Create Access Keys

1. Click on the user you just created
2. Go to the **Security credentials** tab
3. Scroll down to **Access keys**
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **IMPORTANT**: Copy both the **Access key ID** and **Secret access key**
   - You won't be able to see the secret key again after this step!
   - Save them securely

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your AWS credentials:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=accessibooks-media
```

Replace with your actual values:
- `AWS_REGION`: The region where your bucket was created
- `AWS_ACCESS_KEY_ID`: The access key ID from Step 3
- `AWS_SECRET_ACCESS_KEY`: The secret access key from Step 3
- `AWS_S3_BUCKET_NAME`: Your bucket name from Step 1

## Step 5: Test the Connection

You can test your S3 connection by using the S3 service functions in `server/s3.ts`:

```typescript
import { uploadToS3, listObjects } from "./s3";

// Test upload
try {
  await uploadToS3("test/test.txt", "Hello S3!", "text/plain");
  console.log("Upload successful!");
} catch (error) {
  console.error("Upload failed:", error);
}

// Test listing
try {
  const objects = await listObjects();
  console.log("Objects in bucket:", objects);
} catch (error) {
  console.error("List failed:", error);
}
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use IAM policies with least privilege** - Only grant necessary S3 permissions
3. **Rotate access keys regularly** - Create new keys and delete old ones
4. **Use bucket policies** - Configure who can access your bucket
5. **Enable MFA** - Require multi-factor authentication for sensitive operations

## Troubleshooting

### "Access Denied" Error
- Check that your access keys are correct
- Verify IAM user has S3 permissions
- Check bucket policy allows access

### "Bucket does not exist"
- Verify the bucket name is correct (case-sensitive)
- Ensure the bucket is in the correct region

### "Invalid region"
- Check your `AWS_REGION` matches where your bucket was created
- Region format should be like `us-east-1`, `eu-west-1`, etc.

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
