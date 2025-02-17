// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');
let aliPayService = require('../service/AliPayService.js');
let taoBaoService = require('../service/TaoBaoService.js');
let wyMusicService = require('../service/WYMusicService.js');
let pddService = require('../service/PDDService.js');
let aDriveService = require('../service/ADriveService.js');
let chinaMobileService = require('../service/ChinaMobileService.js');

// 设备参数
let deviceWidth = device.width;
let deviceHeight = device.height;

// 账号列表
let globalConfig = deviceService.getGlobalConfig()
let accountList = globalConfig.accountList;

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
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历账号
        for (let i = 0; i < accountList.length; i++) {
            aliPayService.switchAccount(accountList[i].userAccount);
            aliPayService.combo(accountList[i]);
        }
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        this.afterOpt();
        // 更新运行时间
        deviceService.updateLastRunTime();
        log("======mainJob end======");
    },

    /**
     * 星星球任务
     */
    starBallJob: function () {
        log("======starBallJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 打排球
        this.loopPlayStarBall(0);
        log("======starBallJob end======");
    },

    /**
     * 循环打星星球
     */
    loopPlayStarBall: function (count) {
        // 切换账号
        aliPayService.switchAccount(accountList[count % accountList.length].userAccount);
        // 打开蚂蚁庄园
        aliPayService.launchSubApp("蚂蚁庄园");
        // 广告
        deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
        deviceService.comboTextClick(["立即领取", "去收取"], 2000);
        log("星星球");
        // 运动会
        deviceService.clickRate(1300 / 1440, 1100 / 3200, 3000);
        // 星星球
        deviceService.combinedClickText("星星球", 2000);
        // 等待页面加载
        desc("返回").waitFor();
        sleep(3000);
        if (className("android.widget.Button").text("退出挑战").exists()) {
            let recieve = className("android.widget.Button").text("退出挑战").findOne().bounds();
            click(recieve.centerX(), recieve.centerY());
            sleep(2000);
            // 回到首页
            aliPayService.closeSubApp();
            // 计数
            count++;
            if (count < accountList.length) {
                this.loopPlayStarBall(count);
            } else {
                // 复原账号
                aliPayService.switchAccount(accountList[0].userAccount);
                // 清除后台任务
                deviceService.clearBackground();
                // 锁屏
                deviceService.lockDevice();
            }
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
                    press(deviceWidth / 8 * i, deviceHeight / 10 * 4, 30);
                }
                playTime += 240;
                if (playTime > 98000) {
                    toast("停止打排球");
                    break;
                }
            }
            sleep(6000);
            back();
            sleep(1000);
            back();
            sleep(1000);
            // 回到首页
            aliPayService.closeSubApp();
            // 计数
            count++;
            if (count < accountList.length) {
                this.loopPlayStarBall(count);
            } else {
                // 复原账号
                aliPayService.switchAccount(accountList[0].userAccount);
                this.afterOpt();
            }
        }
    },

    /**
     * 能量雨任务
     */
    energyRainJob: function () {
        log("======energyRainJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 收集能量雨
        this.loopEnergyRain(0);
        log("======energyRainJob end======");
    },


    /**
     * 循环能量雨
     */
    loopEnergyRain: function (count) {
        // 切换账号
        let currentAccount = accountList[count % accountList.length];
        aliPayService.switchAccount(currentAccount.userAccount);
        // 打开蚂蚁森林
        aliPayService.launchSubApp("蚂蚁森林");
        // 关闭弹框
        deviceService.comboTextClick(["关闭", "关闭按钮", "知道了"], 1000);
        // 点击“奖励”
        deviceService.clickRate(585 / 1440, 2100 / 3200, 2000);
        // 签到领取活力值、知道了、立即领取、打卡
        deviceService.comboTextClick(["领取", "知道了", "立即领取", "立即领取", "去打卡"], 800);
        // 可以能量雨才操作
        let rainText = "玩一场能量雨 一起拯救绿色能量吧";
        if (text(rainText).findOne()) {
            deviceService.clickNearBy(rainText, "去拯救", 10000);
            deviceService.clickNearBy(rainText, "去赠送", 10000);
            deviceService.clickNearBy(rainText, "去看看", 10000);
            // 收能量
            let nextUsername = accountList[(count + 1) % accountList.length].userName;
            let giveChanceUser = currentAccount.giveChanceUser;
            this.takeEnergyRain(nextUsername, giveChanceUser, false);
            // 回到森林
            back();
            sleep(800);
            // 关闭弹框
            deviceService.combinedClickText("关闭", 800);
            // 给主账号浇水
            if ("346***@qq.com" != accountList[count % accountList.length].userAccount) {
                aliPayService.waterFriend("王明");
            }
            // 回到首页
            aliPayService.closeSubApp();
            // 计数
            count++;
            if (count <= accountList.length) {
                this.loopEnergyRain(count);
            } else {
                this.afterOpt();
            }
        } else {
            // 关闭弹框
            deviceService.combinedClickText("关闭", 800);
            // 给主账号浇水
            if ("346***@qq.com" != accountList[count % accountList.length].userAccount) {
                aliPayService.waterFriend("王明");
            }
            // 回到支付宝首页
            back();
            sleep(2000);
            // 计数
            count++;
            if (count <= accountList.length) {
                this.loopEnergyRain(count);
            } else {
                this.afterOpt();
            }
        }
    },

    /**
     * 收集能量雨
     */
    takeEnergyRain: function (nextUsername, giveChanceUser, vibrateSwitchOff) {
        if (text("送TA机会").exists()) {
            // 只有一个账号
            if (accountList.length == 1) {
                deviceService.combinedClickText("送TA机会", 800);
                this.takeEnergyRain(nextUsername, giveChanceUser, true);
            } else if (text(giveChanceUser).exists()) {
                deviceService.clickNearBy(giveChanceUser, "送TA机会", 800);
                this.takeEnergyRain(nextUsername, giveChanceUser, true);
            } else {
                deviceService.combinedClickText("更多好友", 2500);
                deviceService.clickBrotherIndex(giveChanceUser, 1, 500);
                this.takeEnergyRain(nextUsername, giveChanceUser, true);
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
                back();
                sleep(500);
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
            this.takeEnergyRain(nextUsername, giveChanceUser, true);
        }
        if (text("送TA机会").exists()) {
            // 只有一个账号
            if (accountList.length == 1) {
                deviceService.combinedClickText("送TA机会", 800);
                this.takeEnergyRain(nextUsername, giveChanceUser, true);
            } else if (text(giveChanceUser).exists()) {
                deviceService.clickNearBy(giveChanceUser, "送TA机会", 800);
                this.takeEnergyRain(nextUsername, giveChanceUser, true);
            } else {
                deviceService.combinedClickText("更多好友", 2500);
                deviceService.clickBrotherIndex(giveChanceUser, 1, 500);
                this.takeEnergyRain(nextUsername, giveChanceUser, true);
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
            deviceService.clickRate(360 / 1440, 3110 / 3200, 500);
            deviceService.clickRate(900 / 1440, 3110 / 3200, 500);
            deviceService.clickRate(360 / 1440, 3110 / 3200, 500);
            deviceService.clickRate(180 / 1440, 2560 / 3200, 500);
            deviceService.clickRate(1268 / 1440, 2925 / 3200, 2000);
            // 立即还款
            deviceService.clickRate(720 / 1440, 2975 / 3200, 5000);
            // 立即支付
            deviceService.clickRate(720 / 1440, 2975 / 3200, 5000);
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
        back();
        sleep(800);
        // 退回支付宝首页
        back();
        sleep(800);
        this.afterOpt();
        log("======netBankJob end======");
    },

    /**
     * 发发日任务
     */
    fafaJob: function () {
        if ("23013RK75C" != device.model) {
            return;
        }
        log("======fafaJob start======");
        this.beforeOpt();
        this.openFaFaRi();
        this.FaFaBrowse();
        log("======fafaJob end======");
    },

    /**
     * 发发日任务
     */
    FaFaBrowse: function () {
        deviceService.swipeDown(device.height / 2);
        sleep(5000);
        log("======FaFaBrowse start======");
        let taskNameArray = ["逛5秒得", "去看看", "去领取", "去赚钱", "去逛逛"];
        for (let taskName of taskNameArray) {
            while (text(taskName).exists()) {
                log("======" + taskName + " click======");
                text(taskName).findOne().click();
                sleep(9000);
                back();
                sleep(2000);
                if (!text("元").exists()) {
                    this.openFaFaRi();
                }
            }
        }
        log("======FaFaBrowse end======");
        // 开红包
        for (let i = 100; i > 0; i--) {
            if (text("剩" + i + "次").exists()) {
                deviceService.combinedClickText("剩" + i + "次", 5000);
                deviceService.clickRate(720 / 1440, 2395 / 3200, 800);
            }
        }
        deviceService.clickDIP("android.view.View", 17, 3, 3000);
    },

    /**
     * 打开发发日
     */
    openFaFaRi: function () {
        // 回主页
        home();
        // 清除后台任务
        deviceService.clearBackground();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 切换账号
        aliPayService.switchAccount("346***@qq.com");
        // 打开网商银行
        aliPayService.launchSubApp("网商银行");
        // 打开发发日
        deviceService.clickRate(1005 / 1440, 3100 / 3200, 1800);
        deviceService.combinedClickText("发发日领红包", 2000);
        text("元").waitFor();
        log("======发发日 打开成功======")
        sleep(3000);
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
     * 月月赚任务
     */
    monthBrowse: function () {
        // 遍历任务
        for (let i = 0; i < 35; i++) {
            if (text("立即使用").exists()) {
                this.closeToast();
            }
            if (text("去看看").exists()) {
                text("去看看").click();
                sleep(18000);
                back();
                sleep(2000);
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
        if (className("android.view.View").depth(17).indexInParent(1).exists()) {
            className("android.view.View").depth(17).indexInParent(1).click()
        }
        if (className("android.widget.TextView").depth(17).indexInParent(1).exists()) {
            className("android.widget.TextView").depth(17).indexInParent(1).click()
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
        this.sendOutTools(0);
        this.afterOpt();
        log("======giveToolJob end======");
    },

    /**
     * 同步手环步数
     */
    syncStepJob: function () {
        if (!deviceService.appExists("支付宝") || !deviceService.appExists("Zepp Life")) {
            return;
        }
        log("======syncStepJob start======");
        this.beforeOpt();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 遍历账号
        for (let i = 0; i < accountList.length; i++) {
            // 账号切换
            aliPayService.switchAccount(accountList[i].userAccount);
            // 切回Zepp Life
            deviceService.launch("Zepp Life");
            // 同步数据
            sleep(3000);
            // 我的
            deviceService.clickRate(1200 / 1440, 3150 / 3200, 1000);
            deviceService.comboTextClick(["第三方接入", "支付宝", "解除绑定", "确定", "绑定"], 2000);
            sleep(4000);
            back();
            sleep(800);
            back();
            sleep(800);
            deviceService.combinedClickText("首页", 2000);
            // 下拉刷新同步
            deviceService.swipeDown(device.height);
            sleep(5000);
            // 下拉刷新同步
            deviceService.swipeDown(device.height);
            sleep(5000);
            // 下拉刷新同步
            deviceService.swipeDown(device.height);
            sleep(5000);
            // 启动支付宝
            deviceService.launch("支付宝");
        }
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        this.afterOpt();
        log("======syncStepJob end======");
    },

    /**
     * 循环送道具
     */
    sendOutTools: function (count) {
        // 跳过主账号
        if ("346***@qq.com" == accountList[count % accountList.length].userAccount) {
            count++;
        }
        // 切换账号
        aliPayService.switchAccount(accountList[count % accountList.length].userAccount);
        // 打开蚂蚁森林
        aliPayService.launchSubApp("蚂蚁森林");
        // 上滑
        deviceService.swipeUp(device.height / 2);
        // 上滑
        deviceService.swipeUp(device.height / 2);
        // 新版本收能量
        deviceService.comboTextClick(["查看更多好友", "王明"], 5000);
        deviceService.clickRate(1120 / 1440, 2475 / 3200, 1800);
        let finish = false;
        while (!finish) {
            if (text("赠送").exists()) {
                deviceService.combinedClickText("赠送", 1000);
                deviceService.clickDIP("android.widget.Button", 16, 3, 800);
            } else {
                finish = true;
            }
        }
        deviceService.combinedClickText("关闭", 2800);
        // 退回到列表
        back();
        sleep(800);
        // 退回首页
        back();
        sleep(800);
        // 退回首页
        back();
        sleep(800);
        // 计数
        count++;
        if (count < accountList.length) {
            this.sendOutTools(count);
        } else {
            this.afterOpt();
        }
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
        for (let i = 0; i < accountList.length; i++) {
            aliPayService.switchAccount(accountList[i].userAccount);
            // 打开蚂蚁庄园
            aliPayService.launchSubApp("蚂蚁庄园");
            sleep(5000);
            // 广告
            deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
            // 收取赠送麦子
            deviceService.comboTextClick(["去收取", "立即领取"], 800);
            // 睡觉广告
            deviceService.clickRate(55 / 1440, 2385 / 3200, 800);
            // 收鸡蛋
            deviceService.clickRate(250 / 1440, 2245 / 3200, 800);
            this.loopPlantWheat();
            // 回到首页
            aliPayService.closeSubApp();
        }
        // 切回主账号
        aliPayService.switchAccount(accountList[0].userAccount);
        this.afterOpt();
    },

    /**
     * 中小麦
     */
    loopPlantWheat: function () {
        // 用户
        let userNameArrayAll = ["王明", "coco", "olly", "wm01", "wm02", "wm03", "wm04"];
        // 好友
        deviceService.clickRate(160 / 1440, 2980 / 3200, 3000);
        // 好友列表
        let needPlantUserArray = [];
        for (let i = 0; i < userNameArrayAll.length; i++) {
            if (text(userNameArrayAll[i]).exists() && !text(userNameArrayAll[i] + "（我自己）").exists()) {
                needPlantUserArray.push(userNameArrayAll[i]);
            }
        }
        for (let i = 0; i < needPlantUserArray.length; i++) {
            if (text(needPlantUserArray[i]).exists()) {
                text(needPlantUserArray[i]).findOne().click();
            }
            sleep(3000);
            // 种植
            for (let i = 0; i < 3; i++) {
                // 种麦子
                aliPayService.clickCoordinates("plantWheat");
                // 确认
                deviceService.combinedClickText("确认", 2800);
            }
            // 回到好友
            back();
            sleep(800);
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
        // 88VIP抽茅台
        this.mtLottery();
        // 月月赚任务
        this.monthEarnJob();
        // 发发日任务
        this.fafaJob();
        // 芭芭农场任务
        if (deviceService.appExists("淘宝")) {
            toastLog("芭芭农场任务");
            // 清除后台任务
            deviceService.clearBackground();
            // 启动淘宝
            deviceService.launch("淘宝");
            // 芭芭农场任务
            taoBaoService.babaFarmOption();
        }
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
            let index = "23013RK75C" == device.model ? 1 : 0;
            setText(index++, "15152373096");
            sleep(800);
            setText(index, "SF@ming0935");
            sleep(800);
            deviceService.comboTextClick(["登录", "OK"], 6000);
        }
        deviceService.comboTextClick(["立即签到", "OK"], 3000);
    },

    /**
     * 88VIP抽茅台
     */
    mtLottery: function () {
        if ("23013RK75C" != device.model) {
            return;
        }
        toastLog("88VIP抽茅台");
        // 淘宝
        deviceService.launch("淘宝");
        // 时间
        sleep(3000);
        deviceService.combinedClickDesc("88VIP", 5000);
        deviceService.clickRate(880 / 1440, 1275 / 3200, 3000);
    },

    /**
     * 上班签到
     */
    weLinkSignIn: function () {
        if (deviceService.appExists("WeLink")) {
            this.beforeOpt();
            // 启动welink
            deviceService.launch("WeLink");
            toast("======上下班签到======");
            text("业务").waitFor();
            // 业务、打卡
            deviceService.comboTextClick(["业务", "打卡"], 3000);
            this.afterOpt();
        }
    },

    /**
     * 淘宝芭芭农场任务
     */
    taoBaoBaBaJob: function () {

        log("======taoBaoBaBa start======");
        this.beforeOpt();
        // 启动淘宝
        deviceService.launch("淘宝");
        // 芭芭农场任务
        taoBaoService.babaFarmOption();
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

