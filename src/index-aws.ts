// aws lambda entrypoint
import MD5 from 'crypto-js/md5';
import { loginPayload, DailyTask } from './service';

export async function handler(event: Event) {
    const userPayload: loginPayload = {
        account_name: process.env.ACCOUNT_NAME as string,
        passwd: MD5(process.env.PASSWORD as string).toString(),
        source: 'phone',
    };

    await DailyTask(userPayload);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
    };
}