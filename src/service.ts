// daily tasks login
// shared by entrypoints of cloudflare worker, aws lambda and aliyun fc

import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';

export interface loginPayload {
    account_name: string;
    passwd: string;
    source: string;
}

// 登录，然后提取出 jwt
async function Login(payload: loginPayload): Promise<string> {
    try {
        const response: AxiosResponse = await axios.post('https://gf2-bbs-api.sunborngame.com/login/account', payload);
        console.log(response.data);
        return response.data.data.account.token as string;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        else {
            let errorMessage: string;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else {
                errorMessage = 'An unknown error occurred';
            }
            return errorMessage;
        }
    }
}

interface exchangeRequestBody {
    exchange_id: number;
}

// 兑换物品
async function ExchangeItem(exchange_id: number, token: string): Promise<void> {
    const requestBody: exchangeRequestBody = {
        exchange_id: exchange_id,
    };
    const requestHeader = { Authorization: token } as AxiosRequestHeaders;

    const response = await axios.post('https://gf2-bbs-api.sunborngame.com/community/item/exchange', requestBody, {
        headers: requestHeader
    });
    console.log(response.data);

}

// 每日签到
// 社区经验*55、社区积分*40、情报拼图*10
async function SignIn(token: string): Promise<void> {
    const requestHeader = { Authorization: token } as AxiosRequestHeaders;
    const requestBody = {};

    const response = await axios.post('https://gf2-bbs-api.sunborngame.com/community/task/sign_in', requestBody, {
        headers: requestHeader
    });
    console.log(response.data);

}

// 获取最新发布的帖子列表，只返回前3个帖子的 ID
async function GetTopicList(): Promise<number[]> {
    const response: AxiosResponse = await axios.get('https://gf2-bbs-api.sunborngame.com/community/topic/list?sort_type=2');
    const topicList = response.data.data.list.slice(0, 3);
    const topicIDs: number[] = topicList.map((item: { topic_id: number }) => item.topic_id);
    console.log(topicIDs);
    return topicIDs;
}

// 查看帖子，点赞和分享
// 获得 40+40+40 社区积分
async function TopicHandle(topic_id: number, token: string): Promise<void> {
    const requestHeader = { Authorization: token } as AxiosRequestHeaders;

    // 访问
    let response = await axios.get(`https://gf2-bbs-api.sunborngame.com/community/topic/${topic_id}?id=${topic_id}`,
        {
            headers: requestHeader
        });
    console.log(response.data);

    // 点赞
    response = await axios.get(`https://gf2-bbs-api.sunborngame.com/community/topic/like/${topic_id}?id=${topic_id}`,
        {
            headers: requestHeader
        });
    console.log(response.data);

    // 分享
    response = await axios.get(`https://gf2-bbs-api.sunborngame.com/community/topic/share/${topic_id}?id=${topic_id}`,
        {
            headers: requestHeader
        });
    console.log(response.data);
}

export async function DailyTask(userPayload: loginPayload): Promise<void> {
    // 登录获取 jwt，获取帖子列表
    const [jwtToken, topicList] = await Promise.all([Login(userPayload), GetTopicList()]);

    // 完成每日任务获取积分
    await Promise.all([
        SignIn(jwtToken),
        ...topicList.map(element => TopicHandle(element, jwtToken))
    ]);

    // 用积分兑换物品
    const exchangeIDs: number[] = [1, 1, 2, 3, 4, 5];
    await Promise.all(exchangeIDs.map(element => ExchangeItem(element, jwtToken)));
}