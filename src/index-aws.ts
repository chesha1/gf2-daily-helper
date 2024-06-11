// aws lambda entrypoint
import MD5 from 'crypto-js/md5';
import { loginPayload, DailyTask } from './service';

interface Event {
    PASSWORD: string;
    ACCOUNT_NAME: string;
}

export async function handler(event: Event) {
    const userPayload: loginPayload = {
        account_name: event.ACCOUNT_NAME,
        passwd: MD5(event.PASSWORD).toString(),
        source: 'phone',
    };

    await DailyTask(userPayload);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
    };
}