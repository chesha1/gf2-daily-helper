# gf2-daily-helper
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/chesha1/gf2-daily-helper)

Girls' Frontline 2 Exilium Official Community Check-in Helper

[少前 2 国服官网社区](https://gf2-bbs.sunborngame.com/)每日任务助手

自动化完成签到、获取积分、兑换物品，部署到云厂商的 serverless 服务上，可以实现全自动完成任务

详细的视频介绍：https://www.bilibili.com/video/BV1vS411A7i5/

> [!CAUTION]
> 使用自动化工具可能导致您的账号被封，请谨慎考虑是否使用  
> 目前没见过有人提到用了被封号，但不排除这种可能  
> 我不怕死，我先用了  

## 执行逻辑
进行每日签到，查看帖子、点赞、分享来获取积分，然后兑换可能的物品

由于每天获得的积分，在兑换完每日资源后，只剩 10 个积分，所以有时候需要积累几天，不能立即兑换信息核

## 使用方法
目前提供 5 种使用方法：
1. [Cloudflare Worker](./docs/cloudflare.md)
2. [AWS Lambda](./docs/aws.md)
3. [华为云 函数工作流（推荐中国大陆用户使用）](./docs/huawei-cloud.md)
4. [Github Actions（推荐网络能流畅访问 GitHub 的用户优先使用这个，而不是比较繁琐的华为云，不过需要每 60 天激活一次）](./docs/github-actions.md)
5. [本地运行](./docs/local.md)

阿里云和腾讯云不提供长久免费的 serverless 服务

GCP 对于中国大陆的用户，可能网络不可达

## 有效性
每日助手很依赖这个官方论坛对于每日任务不上难度，不用太多校验手段，所以将来可能会失效

截至 2024 年 12 月 8 日，还能用

## 未来开发
- [ ] 浏览器插件
- [ ] 外服官方社区