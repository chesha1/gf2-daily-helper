<h1>AWS 部署方法</h1>

> [!NOTE]  
> AWS 的注册需要一张外币信用卡

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