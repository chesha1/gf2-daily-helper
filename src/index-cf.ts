import MD5 from 'crypto-js/md5';
import { loginPayload, DailyTask } from './service';

export interface Env {
	PASSWORD: string;
	ACCOUNT_NAME: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const userPayload: loginPayload = {
			account_name: env.ACCOUNT_NAME,
			passwd: MD5(env.PASSWORD).toString(),
			source: 'phone',
		};

		await DailyTask(userPayload);

		return new Response('Success');
	},
};
