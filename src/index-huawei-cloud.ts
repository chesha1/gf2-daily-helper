// huawei cloud FunctionGraph entrypoint
// use tsc --module CommonJS to compile to CommonJS
import MD5 from 'crypto-js/md5.js';
import { loginPayload, DailyTask } from './service.js';
import { Context } from 'vm';

export async function handler(event: Event, context: Context) {
    const userPayload: loginPayload = {
        account_name: context.getUserData('ACCOUNT_NAME') as string,
        passwd: MD5(context.getUserData('PASSWORD') as string).toString(),
        source: 'phone',
    };

    await DailyTask(userPayload);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
    };
}