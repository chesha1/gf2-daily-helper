// Cloudflare Worker Paid Plan Entrypoint

import crypto from 'node:crypto';
import { loginPayload, DailyTask } from './service';

export interface Env {
	PASSWORD: string;
	ACCOUNT_NAME: string;
}

export default {
	async fetch() {
		return new Response('Forbidden', { status: 403 });
	},
	async scheduled(event: Event, env: Env, ctx) {
		const userPayload: loginPayload = {
			account_name: env.ACCOUNT_NAME,
			passwd: crypto.createHash('md5').update(env.PASSWORD).digest('hex'),
			source: 'phone',
		};

		await DailyTask(userPayload);

		return new Response('Success');
	},
};
