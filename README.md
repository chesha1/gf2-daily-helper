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
本项目原生基于 Cloudflare Worker 开发，部署在 Cloudflare Worker 是最简单的

只需要 `git clone` 本项目，直接 `npx wrangler deploy` 即可，在每天的 UTC 时间 21:05（北京时间 05:05），就会执行每日任务

如果需要修改执行时间，可以到 `wrangler.toml` 中修改 cron 表达式

还需要到 web 界面添加两个环境变量 `ACCOUNT_NAME` 和 `PASSWORD`

**但是需要消耗的 CPU Time 大约为 30 ms，已经超过 [Workers Free Plan 的限制](https://developers.cloudflare.com/workers/platform/pricing/#workers)，如果不是付费用户，不太建议使用**

### AWS Lambda
到 [Release 界面](https://github.com/chesha1/gf2-daily-helper/releases)下载 `deploy-aws.zip`

然后到 AWS Lambda 中创建函数，运行时选择 Node.js 20.x

在创建好的函数中，代码源选择“上传自”，选择 “.zip文件”，上传刚才下载的 `deploy-aws.zip`，然后保存

在“配置”界面，“常规配置中”，修改超时时间，最好大于 10 秒

在“环境变量”界面，添加两个环境变量 `ACCOUNT_NAME` 和 `PASSWORD`

现在已经完成了 AWS Lambda 的部署，需要用 Amazon EventBridge 设置一个定时任务

在 Amazon EventBridge，到 Scheduler 的“计划”界面，创建计划

计划模式选择周期性计划，Cron表达式用 05 05 * * ？ *

目标 API 选择 AWS Lambda Invoke，Lambda 函数选择刚才创建的函数

有效负载这里，由于我们的函数不需要输入，直接留空即可

其他全部默认，完成创建

到 CloudWatch 里可以查看运行的日志

**和 Cloudflare 不一样，使用 AWS 部署 gf2-daily-helper 是完全免费的，用量远远达不到免费额度的上限**

### 阿里云函数计算
