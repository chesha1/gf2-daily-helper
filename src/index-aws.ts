// aws lambda entrypoint

import crypto from 'node:crypto';
import { loginPayload, DailyTask } from './service.js';

export async function handler(event: Event) {
    const userPayload: loginPayload = {
        account_name: process.env.ACCOUNT_NAME as string,
        passwd: crypto.createHash('md5').update(process.env.PASSWORD as string).digest('hex'),
    };

    await DailyTask(userPayload);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
    };
}