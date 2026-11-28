import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../env.js";

// temporary, delete after checking
console.log("key id length:", env.AWS_ACCESS_KEY_ID.length);
console.log("secret length:", env.AWS_SECRET_ACCESS_KEY.length);
console.log("secret has outer whitespace:", env.AWS_SECRET_ACCESS_KEY !== env.AWS_SECRET_ACCESS_KEY.trim());

export const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID.trim(),
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY.trim(),
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
});

export const BUCKET = env.S3_BUCKET;