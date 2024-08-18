// S3
import S3 from 'aws-sdk/clients/s3';

export const s3 = new S3({
    endpoint: process.env.R2_URL!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_ACCESS_KEY_SECRET!,
    signatureVersion: "v4",
})