<h1>Cloudflare Worker 部署方法</h1>

> [!NOTE]  
> 并不推荐 cloudflare worker 免费用户使用 cloudflare 部署，免费计划版本的每日助手用了一些方法尽量让 CPU 时间在 10 ms 以内，满足 [Workers Free Plan 的限制](https://developers.cloudflare.com/workers/platform/pricing/#workers)，感觉不太稳定

- [如果你是 cloudflare worker 付费用户](#如果你是-cloudflare-worker-付费用户)
- [如果你是 cloudflare worker 免费用户](#如果你是-cloudflare-worker-免费用户)

# 如果你是 cloudflare worker 付费用户
本项目原生基于 Cloudflare Worker 开发，部署在 Cloudflare Worker 是最简单的

1. 首先需要一个 cloudflare 账号
2. `git clone` 本项目，在项目目录下 `npm i wrangler` 安装依赖
3. `npx wrangler deploy`，会弹出一个页面要求授权，完成操作之后就完成了 cloudflare worker 的部署
4. 登录到 [cloudlfare 控制台](https://dash.cloudflare.com/)，选择刚才部署的 worker，如下图
   ![1](./assets/cloudflare-1.png)
5. 添加两个环境变量 `ACCOUNT_NAME` 和 `PASSWORD`，填写自己的散爆账号和密码，完成后效果如下图
   ![1](./assets/cloudflare-2.png)
6. 现在，在每天的 UTC 时间 21:05（北京时间 05:05），就会执行每日任务

如果需要修改执行时间，可以到 [wrangler.toml](../wrangler.toml) 中修改 cron 表达式

# 如果你是 cloudflare worker 免费用户
开发中