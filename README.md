# gf2-daily-helper
Girls' Frontline 2 Exilium Official Community Check-in Helper

少前2官网社区每日任务助手

自动化完成签到、获取积分、兑换物品，部署到云厂商的 serverless 服务上，可以实现全自动完成任务

## 执行逻辑
进行每日签到，查看帖子、点赞、分享来获取积分，然后兑换可能的物品

由于每天获得的积分，在兑换完每日资源后，只剩 10 个积分，所以有时候需要积累几天，不能立即兑换信息核

## 使用方法
目前支持 3 种使用方法：
1. Cloudflare Worker
2. AWS Lambda
3. 阿里云 函数计算（中国大陆用户推荐）

### Cloudflare Worker
本项目原生基于 Cloudflare Worker 开发

只需要 `git clone` 本项目，`npm i --legacy-peer-deps` 安装依赖后

直接 `npx wrangler deploy` 即可，在每天的 UTC 时间 21:05（北京时间 05:05），就会执行每日任务

如果需要修改执行时间，可以到 `wrangler.toml` 中修改 cron 表达式

还需要到 web 界面添加两个环境变量 `ACCOUNT_NAME` 和 `PASSWORD`
