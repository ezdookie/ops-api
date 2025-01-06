import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client();
const BUCKET_NAME = process.env.BUCKET_NAME;

export const uploadFile = async (file) => {
  // generate a randonm and unique id
  const fileId = uuidv4();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${fileId}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return fileId;
};
