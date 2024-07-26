import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
const runtimeConfig = useRuntimeConfig();

const s3 = new S3Client({
    region: runtimeConfig.awsRegion,
    credentials: {
        accessKeyId: runtimeConfig.awsAccessKeyId,
        secretAccessKey: runtimeConfig.awsSecretAccessKey,
    },
});

export const uploadFileToS3 = async (file) => {

    if (!file || !file[0].filepath) {
        throw new Error('File path is undefined');
    }

    const fileStream = fs.createReadStream(file[0].filepath);

    const fileName= `${Math.floor(Math.random() * 1000)}-${file[0].originalFilename}`

    const uploadParams = {
        Bucket: runtimeConfig.awsBucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: file[0].mimetype,
    };

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        return `https://${runtimeConfig.awsBucketName}.s3.${runtimeConfig.awsRegion}.amazonaws.com/${fileName}`;
    } catch (err) {
        console.error("S3 upload error:", err);
        throw err;
    }
};
