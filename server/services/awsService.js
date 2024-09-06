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

const getFileExtension = (fileName) => {
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex !== -1 ? fileName.substring(dotIndex) : '';
};

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const uploadFileToS3 = async (file) => {

    if (!file || !file[0].filepath) {
        throw new Error('File path is undefined');
    }

    const fileStream = fs.createReadStream(file[0].filepath);

    const fileName = `${generateUUID()}${getFileExtension(file[0].originalFilename)}`;
    const uploadParams = {
        Bucket: runtimeConfig.awsBucketName,
        Key: `bundlelines/files/${fileName}`,
        Body: fileStream,
        ContentType: file[0].mimetype,
    };

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        return `https://static.bundle.app/bundlelines/files/${fileName}`;
    } catch (err) {
        console.error("S3 upload error:", err);
        throw err;
    }
};
