// 本地运行入口文件

import crypto from 'crypto';
import { loginPayload, DailyTask } from './service';

// =================== 配置区域 ===================
// 请在这里填写你的账号信息
const CONFIG = {
    ACCOUNT_NAME: 'your_account_name_here',  // 你的账号名（手机号或邮箱）
    PASSWORD: 'your_password_here',          // 你的密码（明文密码）
};
// ===============================================

async function main(): Promise<void> {
    console.log('🚀 开始执行少女前线2每日任务...');

    // 检查配置是否已填写
    if (CONFIG.ACCOUNT_NAME === 'your_account_name_here' || CONFIG.PASSWORD === 'your_password_here') {
        console.error('❌ 错误: 请在代码中的 CONFIG 对象里设置你的 ACCOUNT_NAME 和 PASSWORD');
        console.error('📍 请编辑 src/index-local.ts 文件中的配置区域');
        process.exit(1);
    }

    const userPayload: loginPayload = {
        account_name: CONFIG.ACCOUNT_NAME,
        passwd: crypto.createHash('md5').update(CONFIG.PASSWORD).digest('hex'),
    };

    try {
        await DailyTask(userPayload);
        console.log('✅ 每日任务执行完成！');
    } catch (error) {
        console.error('❌ 执行过程中出现错误:', error);
        process.exit(1);
    }
}

// 直接执行主函数
main().catch((error) => {
    console.error('❌ 程序执行失败:', error);
    process.exit(1);
}); 