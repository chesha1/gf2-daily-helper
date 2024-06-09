import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import MD5 from 'crypto-js/md5';

export interface Env {
	PASSWORD: string;
	ACCOUNT_NAME: string;
}

interface loginPayload {
	account_name: string;
	passwd: string;
	source: string;
}

interface exchangeRequestBody {
	exchange_id: number;
}

// 登录，然后提取出 jwt
async function Login(payload: loginPayload): Promise<string> {
	try {
		const response: AxiosResponse = await axios.post('https://gf2-bbs-api.sunborngame.com/login/account', payload);
		return response.data.data.account.token as string;
	}
	catch (error) {
		if (axios.isAxiosError(error)) {
			return error.response?.data;
		}
		else {
			return 'An unknown error occurred';
		}
	}
}

// 兑换物品
async function ExchangeItem(exchange_id: number, token: string) {
	const requestBody: exchangeRequestBody = {
		exchange_id: exchange_id,
	};
	const requestHeader = {
		Authorization: token,
	} as AxiosRequestHeaders;
	try {
		const response: AxiosResponse = await axios.post('https://gf2-bbs-api.sunborngame.com/community/item/exchange', requestBody, {
			headers: requestHeader
		});
		return response.data;
	}
	catch (error) {
		return error;
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const userPayload: loginPayload = {
			account_name: env.ACCOUNT_NAME,
			passwd: MD5(env.PASSWORD).toString(),
			source: 'phone',
		};
		const jwtToken: string = await Login(userPayload);
		const data = await ExchangeItem(5, jwtToken);
		const response = JSON.stringify(data);

		return new Response(response);
	},
};
