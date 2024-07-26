import formidable from 'formidable';
import { uploadFileToS3 } from '../services/awsService';

export default defineEventHandler(async (event) => {
    if (event.node.req.method === 'POST') {
        const form = formidable({ multiples: false, keepExtensions: true });

        return new Promise((resolve, reject) => {
            form.parse(event.node.req, async (err, fields, files) => {
                if (err) {
                    reject(createError({ statusCode: 500, message: 'File upload error' }));
                }

                try {
                    const fileUrl = await uploadFileToS3(files.file);
                    resolve({ url: fileUrl });
                } catch (error) {
                    reject(createError({ statusCode: 500, message: 'S3 upload error' }));
                }
            });
        });
    } else {
        return createError({ statusCode: 405, message: 'Method not allowed' });
    }
});
