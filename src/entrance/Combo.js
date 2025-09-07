// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');
let aliPayService = require('../service/AliPayService.js');
let taoBaoService = require('../service/TaoBaoService.js');
let wyMusicService = require('../service/WYMusicService.js');
let pddService = require('../service/PDDService.js');
let aDriveService = require('../service/ADriveService.js');
let doubaoService = require('../service/DoubaoService.js');
let chinaMobileService = require('../service/ChinaMobileService.js');

// 设备参数
let deviceWidth = device.width;
let deviceHeight = device.height;

// 账号列表
let globalConfig = deviceService.getGlobalConfig()
let accountList = globalConfig.accountList;
let taoBaoAccountList = globalConfig.taoBaoAccountList;

module.exports = {

    /**
     * 前置操作
     */
    beforeOpt: function () {
        // 唤醒设备
        deviceService.wakeUpDevice();
        // 清除后台任务
        deviceService.clearBackground();
    },

    /**
     * 入口
     */
    mainJob: function () {
        log("======mainJob start======");
        this.beforeOpt();
        if (!deviceService.appExists("支付宝")) {
            return;
        }
        // 静音
        let musicVolume = deviceService.mute();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历账号
        accountList.forEach(account => {
            aliPayService.switchAccount(account.userAccount);
            aliPayService.combo(account);
        });
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        // 还原声音
        deviceService.revertMute(musicVolume);
        // 更新运行时间
        deviceService.updateLastRunTime();
        this.afterOpt();
        log("======mainJob end======");
    },

    /**
     * 庄园家庭任务
     */
    chickenFamilyAndSportJob: function () {
        log("======plantWheatJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历账号
        accountList.forEach(account => {
            aliPayService.switchAccount(account.userAccount);
            // 打开蚂蚁庄园
            aliPayService.launchSubApp("蚂蚁庄园");
            // 广告
            deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
            // 收取赠送麦子
            deviceService.comboTextClick(["去收取", "立即领取"], 800);
            // 睡觉广告
            deviceService.clickRate(55, 2385, 800);
            // 收鸡蛋
            deviceService.clickRate(250, 2245, 800);
            // 小鸡家庭任务
            this.playChickenFamily(account);
            // 小鸡运动会
            this.playChickenSport();
            // 回到首页
            aliPayService.closeSubApp();
        });
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        this.afterOpt();
        log("======plantWheatJob end======");
    },

    /**
     * 小鸡家庭任务
     */
    playChickenFamily: function (account) {
        // 开关
        if (!globalConfig.chickenFamilySwitch) {
            return;
        }
        // 家庭
        deviceService.clickRate(640, 2950, 8000);
        text("相亲相爱一家人").waitFor();
        sleep(1000);
        // 立即签到
        deviceService.clickRate(720, 3000, 5000);
        // 去捐蛋
        if (text("去捐蛋").exists()) {
            deviceService.comboTextClick(["去捐蛋", "去捐蛋", "立即捐蛋", "立即捐蛋"], 5000);
            deviceService.back(800);
            deviceService.back(800);
            deviceService.combinedClickText("关闭", 2800);
        }
        // 去请客
        if (text("去请客").exists() && "王明" != account.userName) {
            deviceService.combinedClickText("去请客", 3800);
            if (text("美食不足，去抽奖得美食").exists()) {
                // 关闭弹框
                className("android.widget.TextView").depth(16).indexInParent(8).findOne().click();
            } else {
                deviceService.combinedClickText("确认", 3800);
            }
        }
        // 去分享
        if (text("去分享").exists()) {
            deviceService.comboTextClick([
                "去分享",
                "分享给Ta们 亲密度+6",
                "分享给Ta们 亲密度+5",
                "分享给Ta们 亲密度+4",
                "分享给Ta们 亲密度+3",
                "分享给Ta们 亲密度+2",
                "分享给Ta们 亲密度+1"
            ], 5000);
        }
        // 去喂食
        if (text("去喂食").exists()) {
            deviceService.comboTextClick(["去喂食", "确认", "确认 亲密度+1"], 5000);
        }
        // 去指派
        if (text("去指派").exists()) {
            deviceService.comboTextClick(["去指派", "确认"], 5000);
            // 立即签到
            deviceService.clickRate(720, 3000, 5000);
        }
        // 去捐步
        if (text("去捐步").exists()) {
            deviceService.comboTextClick(["去捐步", "去捐步数", "立即捐步", "知道了"], 3000);
            deviceService.combinedClickDesc("关闭", 2800);
            deviceService.combinedClickText("关闭", 2800);
        }
        // 回退
        deviceService.back(800);
    },

    /**
     * 小鸡运动会
     */
    playChickenSport: function () {
        // 运动会
        deviceService.clickRate(1300, 1100, 3000);
        // 欢乐揍小鸡
        this.punchChicken();
        // 星星球
        this.playStarBall();
        // 立即开宝箱 还有3个宝箱
        for (let i = 10; i > 0; i--) {
            deviceService.combinedClickText("立即开宝箱 还有" + i + "个宝箱", 6000);
        }
        for (let i = 10; i > 0; i--) {
            deviceService.combinedClickText("继续开宝箱 还有" + i + "个宝箱", 6000);
        }
    },

    /**
     * 欢乐揍小鸡
     */
    punchChicken: function () {
        deviceService.comboTextClick([
            "欢乐揍小鸡 暴揍偷吃小鸡 每日首次得60g饲料可得1个宝箱 马上玩",
            "欢乐揍小鸡 暴揍偷吃小鸡 每日首次得60g饲料可得1个宝箱 继续玩",
            "欢乐揍小鸡 首次得60g饲料+1 去玩"
        ], 6000);
        if (text("回到蚂蚁庄园 >").exists()) {
            text("回到蚂蚁庄园 >").click();
            sleep(1000);
        } else {
            deviceService.combinedClickText("original", 2000);
            let count = 0;
            while (true) {
                for (let i = 1; i < 8; i++) {
                    press(device.width / 8 * i, device.height / 10, 10);
                }
                count += 80;
                if (text("回到蚂蚁庄园 >").exists() || count > 28000) {
                    text("回到蚂蚁庄园 >").click();
                    sleep(2000);
                    break;
                }
            }
        }
    },

    /**
     * 玩星星球
     */
    playStarBall: function () {
        // 星星球
        deviceService.comboTextClick([
            "星星球 我的球拍得老棒了 每日首次得300分可得1个宝箱 马上玩",
            "星星球 我的球拍得老棒了 每日首次得300分可得1个宝箱 继续玩",
            "星星球 首次得300分+1 去玩"
        ], 2000);
        // 等待页面加载
        desc("返回").waitFor();
        sleep(3000);
        if (className("android.widget.Button").text("退出挑战").exists()) {
            let recieve = className("android.widget.Button").text("退出挑战").findOne().bounds();
            click(recieve.centerX(), recieve.centerY());
            sleep(2000);
        } else {
            // 玩法提示
            deviceService.clickDIP("android.view.View", 14, 1, 800);
            // 开始
            click(deviceWidth / 2, deviceHeight / 4 * 3);
            sleep(100);
            click(deviceWidth / 2, deviceHeight / 4 * 3);
            sleep(100);

            let playTime = 0;
            while (true) {
                for (let i = 1; i < 8; i++) {
                    press(deviceWidth / 8 * i, deviceHeight / 10 * 4, 20);
                }
                playTime += 160;
                if (playTime > 98000) {
                    toast("停止打排球");
                    break;
                }
            }
            sleep(6000);
            deviceService.back(1000);
        }
    },

    /**
     * 赚能量任务
     */
    forestEnergyJob: function () {
        log("======forestEnergyJob start======");
        this.beforeOpt();
        // 静音
        let musicVolume = deviceService.mute();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历
        for (let i = 0; i <= accountList.length; i++) {
            // 最后一次切回主账号
            let account = (i == accountList.length ? accountList[0] : accountList[i]);
            // 切换账号
            aliPayService.switchAccount(account.userAccount);
            // 森林能量
            this.doForestEnergyTask(account);
        }
        // 还原声音
        deviceService.revertMute(musicVolume);
        log("======forestEnergyJob end======");
        this.afterOpt()
    },

    /**
     * 能量雨任务
     */
    energyRainJob: function () {
        log("======forestEnergyJob start======");
        this.beforeOpt();
        // 静音
        let musicVolume = deviceService.mute();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历
        for (let i = 0; i <= accountList.length; i++) {
            // 最后一次切回主账号
            let account = (i == accountList.length ? accountList[0] : accountList[i]);
            // 切换账号
            aliPayService.switchAccount(account.userAccount);
            // 打开蚂蚁森林
            aliPayService.launchSubApp("蚂蚁森林");
            // 关闭弹框
            aliPayService.clearForestDialog();
            // 能量雨
            deviceService.comboTextClick(["拼手速赢", "限时抢收", "天降能量", "能量雨"], 5000);
            // 能量雨任务
            let giveChanceUser = account.giveChanceUser;
            this.takeEnergyRain(giveChanceUser, false);
            // 回到森林
            deviceService.back(800);
            // 关闭弹框
            deviceService.comboTextClick(["关闭", "关闭奖励弹窗"], 800);
            // 给主账号浇水
            if ("346***@qq.com" != account.userAccount) {
                aliPayService.waterFriend("王明");
            }
            // 回到首页
            aliPayService.closeSubApp();
        }
        // 还原声音
        deviceService.revertMute(musicVolume);
        log("======forestEnergyJob end======");
        this.afterOpt()
    },

    /**
     * 森林能量
     */
    doForestEnergyTask: function (account) {
        // 打开蚂蚁森林
        aliPayService.launchSubApp("蚂蚁森林");
        // 关闭弹框
        aliPayService.clearForestDialog();
        // 点击“奖励”
        deviceService.clickRate(585, 2100, 2000);
        text("我的活力值").waitFor();
        // 森林寻宝
        this.forestTreasureHunt();
        // 活力值任务
        this.vitalityTask(account.userName);
        // 签到领取活力值、知道了、立即领取、打卡
        deviceService.comboTextClick(["领取", "知道了", "立即领取", "立即领取", "去打卡"], 800);
        while (text("立即领取").exists()) {
            text("立即领取").click();
            sleep(1000);
        }
        // 关闭弹框
        deviceService.comboTextClick(["关闭", "关闭奖励弹窗"], 800);
        // 给主账号浇水
        if ("346***@qq.com" != account.userAccount) {
            aliPayService.waterFriend("王明");
        }
        // 回到首页
        aliPayService.closeSubApp();
    },

    /**
     * 活力值任务
     */
    vitalityTask: function (userName) {
        //  获取配置
        let jsonString = files.read("/sdcard/脚本/WmScript/resource/config/user/" + userName + ".json");
        let userConfig = JSON.parse(jsonString);
        let taskList = userConfig.vitalityTaskList;
        taskList.forEach(task => {
            if (!text(task.taskName).exists() || !text(task.taskName).findOne().parent().findOne(text(task.buttonName))) {
                return;
            }
            log("=== vitalityTask === " + task.taskName + " ===")
            text(task.taskName).findOne().parent().findOne(text(task.buttonName)).click();
            sleep(2000);
            // 如果没有跳转页面，跳过
            if (text("我的活力值").exists()) {
                return;
            }
            // 页面加载
            sleep(5000);
            if (task.taskName.indexOf("15s") >= 0 || task.taskName.indexOf("15秒") >= 0) {
                sleep(24000);
            }
            if (text("我的活力值").exists()) {
                return;
            }
            deviceService.back(1000);
            if (!text("我的活力值").exists()) {
                // 清除后台任务
                deviceService.clearBackground();
                // 启动支付宝
                deviceService.launch("支付宝");
                // 打开蚂蚁森林
                aliPayService.launchSubApp("蚂蚁森林");
                // 关闭弹框
                aliPayService.clearForestDialog();
                // 点击“奖励”
                deviceService.clickRate(585, 2100, 2000);
            }
        });
    },

    /**
     * 森林寻宝
     */
    forestTreasureHunt: function () {
        // 森林寻宝
        deviceService.clickRate(1225, 915, 3000);
        // 签到
        deviceService.combinedClickText("签到", 1000);
        // 去逛逛
        while (text("去逛逛").exists()) {
            deviceService.combinedClickText("去逛逛", 8000);
            // 实名认证的跳出
            if (text("实名认证").exists()) {
                deviceService.back(1000);
                // 森林寻宝
                if (text("我的活力值").exists()) {
                    deviceService.clickRate(1225, 915, 3000);
                }
                break;
            }
            deviceService.swipeViewTask(18000);
            deviceService.back(1000);
            deviceService.combinedClickText("领取", 1000);
        }
        // 补充领取
        while (text("领取").exists()) {
            deviceService.combinedClickText("领取", 1000);
        }
        // 立即抽奖
        while (text("次机会").exists()) {
            deviceService.combinedClickText("次机会", 1000);
            // 关闭
            deviceService.clickRate(720, 2980, 2000);
        }
        deviceService.back(1000);
    },

    /**
     * 收集能量雨
     */
    takeEnergyRain: function (giveChanceUser, vibrateSwitchOff) {
        if (text("送TA机会").exists()) {
            // 只有一个账号
            if (accountList.length == 1) {
                deviceService.combinedClickText("送TA机会", 800);
                this.takeEnergyRain(giveChanceUser, true);
            } else if (text(giveChanceUser).exists()) {
                deviceService.clickNearBy(giveChanceUser, "送TA机会", 800);
                this.takeEnergyRain(giveChanceUser, true);
            } else {
                deviceService.combinedClickText("更多好友", 2500);
                deviceService.clickBrotherIndex(giveChanceUser, 1, 500);
                this.takeEnergyRain(giveChanceUser, true);
            }
            return;
        }
        if (text("能量拯救日榜").exists() || text("今日累计获取").exists()) {
            toastLog("已收能量，跳过任务");
            return;
        }
        // 关闭震动
        if (!vibrateSwitchOff) {
            deviceService.clickDIP("android.widget.FrameLayout", 7, 2, 1000);
            deviceService.combinedClickText("关闭震动", 800);
            if (text("开启震动").exists()) {
                deviceService.back(500);
            }
        }
        deviceService.comboTextClick(["立即开启", "开启能量拯救之旅"], 2000);
        let count = 0;
        while (true) {
            for (let i = 1; i < 8; i++) {
                press(deviceWidth / 8 * i, deviceHeight / 10, 10);
            }
            count += 80;
            if (text("恭喜获得").exists() || text("送TA机会").exists() || count > 30000) {
                break;
            }
        }
        sleep(1800);
        if (text("再来一次").exists()) {
            deviceService.combinedClickText("再来一次", 800);
            this.takeEnergyRain(giveChanceUser, true);
        }
        if (text("送TA机会").exists()) {
            // 只有一个账号
            if (accountList.length == 1) {
                deviceService.combinedClickText("送TA机会", 800);
                this.takeEnergyRain(giveChanceUser, true);
            } else if (text(giveChanceUser).exists()) {
                deviceService.clickNearBy(giveChanceUser, "送TA机会", 800);
                this.takeEnergyRain(giveChanceUser, true);
            } else {
                deviceService.combinedClickText("更多好友", 2500);
                deviceService.clickBrotherIndex(giveChanceUser, 1, 500);
                this.takeEnergyRain(giveChanceUser, true);
            }
        }
    },

    /**
     * 网商任务
     */
    netBankJob: function () {
        log("======netBankJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 切换账号
        aliPayService.switchAccount("346***@qq.com");
        // 打开网商银行
        aliPayService.launchSubApp("网商银行");
        sleep(3000);
        // 还款
        deviceService.combinedClickText("转账", 3000);
        deviceService.comboTextClick(["还款", "我知道了"], 5000);
        let count = 0;
        while (count < 5) {
            deviceService.combinedClickText("立即还", 3000);
            // 点击还款金额输入
            deviceService.combinedClickText("单笔最高100万元，预计实时到账", 1000);
            sleep(800);
            // 设置金额
            // deviceService.comboTextClick(["0",".", "0", "1", "确认"], 80);
            deviceService.clickRate(360, 3110, 500);
            deviceService.clickRate(900, 3110, 500);
            deviceService.clickRate(360, 3110, 500);
            deviceService.clickRate(180, 2560, 500);
            deviceService.clickRate(1268, 2925, 2000);
            // 立即还款
            deviceService.clickRate(720, 2975, 5000);
            // 立即支付
            deviceService.clickRate(720, 2975, 5000);
            // pass
            deviceService.combinedClickText("使用密码", 1000);
            deviceService.comboTextClick(["5", "9", "4", "6", "0", "6"], 80);
            text("完成").waitFor();
            sleep(800);
            // 点击完成
            if (text("完成").exists()) {
                click("完成");
                sleep(2000);
                // 计数
                count++;
            }
        }
        // 退回网商首页
        deviceService.back(800);
        // 退回支付宝首页
        deviceService.back(800);
        this.afterOpt();
        log("======netBankJob end======");
    },

    /**
     * 月月赚任务
     */
    monthEarnJob: function () {
        // 只有主号做任务
        if ("23013RK75C" != device.model) {
            return;
        }
        log("======monthEarnJob start======");
        this.openMonthRich();
        for (let i = 0; i < 5; i++) {
            this.monthBrowse();
            if (text("更多任务").exists()) {
                text("更多任务").findOne().click();
                sleep(2000);
            }
        }
        log("======monthEarnJob end======");
    },

    /**
     * 月月赚浏览
     */
    monthBrowse: function () {
        // 遍历任务
        for (let i = 0; i < 35; i++) {
            if (text("立即使用").exists()) {
                this.closeToast();
            }
            if (text("去看看").exists()) {
                text("去看看").click();
                sleep(3000);
                deviceService.back(2000);
                if (!text("立即使用").exists()) {
                    this.openMonthRich();
                }
                this.closeToast();
            }
        }
    },

    /**
     * 关闭弹窗
     */
    closeToast: function () {
        if (className("android.widget.TextView").depth(18).indexInParent(1).exists()) {
            className("android.widget.TextView").depth(18).indexInParent(1).click()
        }
        sleep(1000);
    },

    /**
     * 打开月月赚
     */
    openMonthRich: function () {
        // 回主页
        home();
        // 清除后台任务
        deviceService.clearBackground();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 点击搜索
        deviceService.combinedClickText("搜索", 1000);
        // 输入月月赚
        setText("月月赚");
        deviceService.combinedClickText("搜索", 5000);
        // 打开月月赚
        deviceService.combinedClickText("月月赚 ", 5000);
    },

    /**
     * 送道具任务
     */
    giveToolJob: function () {
        log("======giveToolJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 循环送道具
        this.sendOutTools();
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        this.afterOpt();
        log("======giveToolJob end======");
    },

    /**
     * 同步手环步数
     */
    syncStepJob: function () {
        if (!deviceService.appExists("支付宝") || !deviceService.appExists("Zepp Life") || deviceService.earlierThan(7, 0)) {
            return;
        }
        log("======syncStepJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历账号
        for (let i = 0; i <= accountList.length; i++) {
            // 最后一次切回主账号
            let account = (i == accountList.length ? accountList[0] : accountList[i]);
            // 账号切换
            aliPayService.switchAccount(account.userAccount);
            // 切回Zepp Life
            deviceService.launch("Zepp Life");
            // 启动加载
            sleep(6000);
            // 我的
            deviceService.clickRate(1200, 3150, 1000);
            // 检查是否登录
            if (id("com.xiaomi.hm.health:id/mine_name").exists() && '立即登录' == id("com.xiaomi.hm.health:id/mine_name").findOne().text()) {
                deviceService.comboTextClick(["立即登录", "登录/注册"], 2000);
                className("android.widget.CheckBox").id("com.xiaomi.hm.health:id/login_agreement_checkbox").click();
                sleep(800);
                deviceService.comboTextClick(["登录此账号", "确认授权"], 3000);
                sleep(8000);
                // 我的
                deviceService.clickRate(1200, 3150, 1000);
            }
            deviceService.comboTextClick(["第三方接入", "支付宝", "解除绑定", "确定", "绑定"], 2000);
            sleep(4000);
            deviceService.back(800);
            deviceService.back(800);
            deviceService.combinedClickText("首页", 2000);
            for (let i = 0; i < 5; i++) {
                // 下拉刷新同步
                deviceService.swipeDown(device.height);
                sleep(5000);
            }
            // 启动支付宝
            deviceService.launch("支付宝");
        }
        // 清除后台任务
        deviceService.clearBackground();
        // 解除后台锁定
        deviceService.killLockedApp("Zepp Life");
        // 锁屏
        deviceService.lockDevice();
        log("======syncStepJob end======");
    },

    /**
     * 循环送道具
     */
    sendOutTools: function () {
        // 跳过主账号
        accountList.forEach(account => {
            if ("346***@qq.com" == account.userAccount) {
                return;
            }
            // 切换账号
            aliPayService.switchAccount(account.userAccount);
            // 打开蚂蚁森林
            aliPayService.launchSubApp("蚂蚁森林");
            // 上滑
            deviceService.swipeUp(device.height / 2);
            // 上滑
            deviceService.swipeUp(device.height / 2);
            // 新版本收能量
            deviceService.comboTextClick(["left 收我最多榜 right", "收我最多榜", "查看更多好友", "王明"], 5000);
            // 送道具
            deviceService.clickRate(1120, 2475, 1800);
            // 赠送
            while (text("赠送").exists()) {
                text("赠送").click();
                sleep(1000);
            }
            aliPayService.closeSubApp();
        });
    },

    /**
     * 积分补签到
     */
    makeUpSignInJob: function () {
        log("======makeUpSignInJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 我的 - 支付宝会员
        deviceService.comboTextClick(["我的", "支付宝会员"], 2000);
        // 关闭广告
        deviceService.combinedClickDesc("关闭", 800);
        // 全部领取积分 - 每日签到
        deviceService.comboTextClick(["全部领取", "每日签到"], 2000);
        let array = [
            "我要补签",
            "补签卡",
            "立即兑换",
            "6.使用补签卡后，次日签到获得的积分将按照最新连续签到天数进行计算。",
            "6.使用补签卡后，次日签到获得的积分将按照最新连续签到天数进行计算。",
            "去使用",
            "补签卡X1",
            "推荐补签",
            "立即补签"
        ];
        for (let i = 0; i < 100; i++) {
            deviceService.comboTextClick(array, 3000);
            sleep(3000);
        }
        if (!text("首页").exists()) {
            // 关闭签到
            deviceService.clickDIP("android.widget.FrameLayout", 9, 0, 1000);
        }
        // 首页
        deviceService.combinedClickText("首页", 2000);
        this.afterOpt();
        log("======makeUpSignInJob end======");

    },

    /**
     * 种植小麦
     */
    plantWheatJob: function () {
        log("======plantWheatJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历账号
        accountList.forEach(account => {
            aliPayService.switchAccount(account.userAccount);
            // 打开蚂蚁庄园
            aliPayService.launchSubApp("蚂蚁庄园");
            // 广告
            deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
            // 收取赠送麦子
            deviceService.comboTextClick(["去收取", "立即领取"], 800);
            // 睡觉广告
            deviceService.clickRate(55, 2385, 800);
            // 收鸡蛋
            deviceService.clickRate(250, 2245, 800);
            this.batchPlantWheat();
            // 回到首页
            aliPayService.closeSubApp();
        });
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        this.afterOpt();
        log("======plantWheatJob end======");
    },

    /**
     * 种小麦
     */
    batchPlantWheat: function () {
        // 用户
        let userNameArrayAll = ["王明", "coco", "olly", "wm01", "wm02", "wm03", "wm04"];
        // 好友
        deviceService.clickRate(160, 2980, 3000);
        // 遍历列表
        if (className("android.widget.Button").depth(18).exists()) {
            let buttons = className("android.widget.Button").depth(18).find();
            buttons.forEach(indexButton => {
                userNameArrayAll.forEach(searchText => {
                    let buttonText = indexButton.text();
                    if (buttonText.indexOf(searchText) > -1 && buttonText.indexOf("（我自己）") == -1) {
                        // 点击好友
                        indexButton.click();
                        sleep(5000);
                        // 种植
                        for (let i = 0; i < 3; i++) {
                            // 种麦子
                            deviceService.clickRate(465, 2965, 800);
                            // 确认
                            deviceService.combinedClickText("确认", 2800);
                        }
                        // 回到好友
                        deviceService.back(800);
                    }
                });
            });
        }
        // 回到庄园
        deviceService.combinedClickText("关闭", 1800);
    },

    /**
     * 天天来签到
     */
    allSignJob: function () {
        log("======allSignJob start======");
        this.beforeOpt();
        // 拼多多签到
        pddService.signIn();
        // 中国移动签到
        chinaMobileService.signIn();
        // 网易云音乐签到
        wyMusicService.signIn();
        // 阿里云盘签到
        aDriveService.signIn();
        // 星空内网传递签到
        this.starryFrpSignIn();
        // 网上国网签到
        this.wsgwSignIn();
        // 88VIP抽茅台
        this.mtLottery();
        // 月月赚任务
        this.monthEarnJob();
        // 芭芭农场任务
        this.taoBaoBaBaJob();
        // 家庭和运动
        this.chickenFamilyAndSportJob();
        // 同步步数
        this.syncStepJob();
        this.afterOpt();
    },

    /**
     * 星空内网穿透签到
     */
    starryFrpSignIn: function () {
        toastLog("星空内网传递签到");
        // 星空内网穿透
        let url = "https://frp.starryfrp.com/console/Sign";
        // 打开网页
        app.openUrl(url);
        sleep(5000);
        if (text("登录").exists()) {
            setText(1, "15152373096");
            sleep(800);
            setText(2, "SF@ming0935");
            sleep(800);
            deviceService.comboTextClick(["登录", "OK"], 6000);
        }
        deviceService.comboTextClick(["立即签到", "OK"], 3000);
    },

    /**
     * 网上国网签到
     */
    wsgwSignIn: function () {
        if (!deviceService.appExists("网上国网")) {
            return;
        }
        toastLog("网上国网签到");
        // 网上国网
        deviceService.launch("网上国网");
        // 时间
        sleep(3000);
        // 我的
        deviceService.clickRate(1400, 3100, 3000);
        // 签到
        deviceService.comboTextClick(["做任务提升等级", "签到"], 8000);
        // 收下
        deviceService.clickRate(720, 1915, 3000);
    },

    /**
     * 88VIP抽茅台
     */
    mtLottery: function () {
        toastLog("88VIP抽茅台");
        // 淘宝
        deviceService.launch("淘宝");
        // 时间
        sleep(3000);
        if (desc("88VIP").exists()) {
            deviceService.combinedClickDesc("88VIP", 5000);
            deviceService.comboTextClick(["抢茅台", "立即抢茅台"], 4000);
        }
    },

    /**
     * 淘宝芭芭农场任务
     */
    taoBaoBaBaJob: function () {
        if (!deviceService.appExists("淘宝")) {
            return;
        }
        log("======taoBaoBaBa start======");
        this.beforeOpt();
        // 静音
        let musicVolume = deviceService.mute();
        // 启动淘宝
        deviceService.launch("淘宝");
        // 广告弹框
        deviceService.comboDescClick(["关闭按钮", "关闭"], 3000);
        // 遍历
        for (let i = 0; i <= taoBaoAccountList.length; i++) {
            // 最后一次切回主账号
            let account = (i == taoBaoAccountList.length ? taoBaoAccountList[0] : taoBaoAccountList[i]);
            // 切换账号
            taoBaoService.switchAccount(account);
            // 广告弹框
            deviceService.comboDescClick(["关闭按钮", "关闭"], 3000);
            // 芭芭农场任务
            taoBaoService.babaFarmTask(account);
        }
        // 还原声音
        deviceService.revertMute(musicVolume);
        log("======taoBaoBaBa end======");
        this.afterOpt()
    },

    /**
     * 后置操作
     */
    afterOpt: function () {
        // 清除后台任务
        deviceService.clearBackground();
        // 锁屏
        deviceService.lockDevice();
    }
}