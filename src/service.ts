// daily tasks logic
// shared by entrypoints of cloudflare worker, aws lambda and so on

export interface loginPayload {
    account_name: string;
    passwd: string;
    source?: string;
}

interface loginResponse {
    Code: number;
    Message: string;
    data: {
        account: {
            token: string;
        };
    };
}

interface communityResponse {
    data: {
        list: {
            topic_id: number;
        }[];
    };
}

async function delay(ms: number): Promise<void> {
    return new Promise(function (resolve: () => void): void {
        setTimeout(resolve, ms);
    });
}

// 登录，然后提取出 jwt
async function Login(payload: loginPayload): Promise<string> {
    // 检查是否是邮箱
    if (payload.account_name.indexOf('@') === -1) {
        payload.source = 'phone';
    } else {
        payload.source = 'mail';
    }

    try {
        const response = await fetch('https://gf2-bbs-api.sunborngame.com/login/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json() as loginResponse;
        if (data.Code === 0) {
            data.Message = 'Login success';
            console.log(data);
        } else {
            console.log(data);
        }
        return data.data.account.token as string;
    } catch (error) {
        let errorMessage: string;
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = 'An unknown error occurred';
        }
        console.log(error);
        return errorMessage;
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

    try {
        const response = await fetch('https://gf2-bbs-api.sunborngame.com/community/item/exchange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
    }
}

// 每日签到
// 社区经验*55、社区积分*40、情报拼图*10
async function SignIn(token: string): Promise<void> {
    const requestBody = {};

    try {
        const response = await fetch('https://gf2-bbs-api.sunborngame.com/community/task/sign_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
    }
}

// 获取最新发布的帖子列表，只返回前3个帖子的 ID
async function GetTopicList(): Promise<number[]> {
    try {
        const response = await fetch('https://gf2-bbs-api.sunborngame.com/community/topic/list?sort_type=2');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as communityResponse;
        const topicList = data.data.list.slice(0, 3);
        const topicIDs: number[] = topicList.map((item: { topic_id: number }) => item.topic_id);
        console.log(topicIDs);
        return topicIDs;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        return [];
    }
}

// 查看帖子，点赞和分享
// 获得 40+40+40 社区积分
async function TopicHandle(topic_id: number, token: string): Promise<void> {
    const requestHeader = {
        'Authorization': token
    };

    try {
        // 访问
        let response = await fetch(`https://gf2-bbs-api.sunborngame.com/community/topic/${topic_id}?id=${topic_id}`, {
            method: 'GET',
            headers: requestHeader
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data);

        // 点赞
        response = await fetch(`https://gf2-bbs-api.sunborngame.com/community/topic/like/${topic_id}?id=${topic_id}`, {
            method: 'GET',
            headers: requestHeader
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        console.log(data);

        // 分享
        response = await fetch(`https://gf2-bbs-api.sunborngame.com/community/topic/share/${topic_id}?id=${topic_id}`, {
            method: 'GET',
            headers: requestHeader
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        console.log(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
    }
}

export async function DailyTask(userPayload: loginPayload): Promise<void> {
    console.log('Start daily tasks');
    try {
        // 登录获取 jwt，获取帖子列表
        const [jwtToken, topicList] = await Promise.all([Login(userPayload), GetTopicList()]);
        console.log('Login and get topic list completed');

        try {
            // 完成每日任务获取积分
            await Promise.all([
                SignIn(jwtToken),
                ...topicList.map(element => TopicHandle(element, jwtToken))
            ]);
            console.log('Daily tasks completed');
        } catch (taskError) {
            console.error('Error completing daily tasks:', taskError instanceof Error ? taskError.message : taskError);
        }

        try {
            // 用积分兑换物品
            const exchangeIDs: number[] = [1, 1, 2, 3, 4, 5, 7];

            // 请求过快在有的地方会报 429
            // await Promise.all(exchangeIDs.map(element => ExchangeItem(element, jwtToken)));
            for (const element of exchangeIDs) {
                await ExchangeItem(element, jwtToken);
                await delay(1000); // 每次请求间隔1秒
            }
            console.log('Items exchanged');
        } catch (exchangeError) {
            console.error('Error exchanging items:', exchangeError instanceof Error ? exchangeError.message : exchangeError);
        }

    } catch (loginOrListError) {
        console.error('Error logging in or getting topic list:', loginOrListError instanceof Error ? loginOrListError.message : loginOrListError);
    }
}
