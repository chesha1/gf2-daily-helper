<h1>华为云部署方法</h1>

关于华为云部署，有详细的视频教程：https://www.bilibili.com/video/BV1vS411A7i5/

华为云函数工作流和 AWS Lambda 类似

到函数工作流界面，函数-函数列表，右上角“创建函数”

类型选择“创建空白函数”，函数类型选择“事件函数”，区域建议选择默认的“华东-上海一”（这一选择影响后面的 cron 表达式）

运行时选择 Node.js 16.17（如果有更加新的 Node.js 的版本请选择更新的版本），然后完成创建

到 [Release 界面](https://github.com/chesha1/gf2-daily-helper/releases)下载 `deploy-huawei-cloud.zip`

在创建好的函数中的“代码”界面右上角，选择“上传自”“Zip文件”，上传刚才下载好的 `deploy-huawei-cloud.zip`

到“设置”界面，“常规设置”中调整“执行超时时间”，最好大于 10 秒

在“环境变量”中添加两个环境变量 `ACCOUNT_NAME` 和 `PASSWORD`

在“触发器”中“创建触发器”，触发器类型选择“定时触发器”，触发规则选择“Cron表达式”，填写 0 05 05 * * *