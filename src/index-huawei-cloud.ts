// huawei cloud FunctionGraph entrypoint
// use tsc --module CommonJS to compile to CommonJS

import crypto from 'node:crypto';
import { loginPayload, DailyTask } from './service.js';
import { Context } from 'vm';

export async function handler(event: Event, context: Context) {
    const userPayload: loginPayload = {
        account_name: context.getUserData('ACCOUNT_NAME') as string,
        passwd: crypto.createHash('md5').update(context.getUserData('PASSWORD') as string).digest('hex'),
    };

    await DailyTask(userPayload);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
    };
}