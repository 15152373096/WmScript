// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');
let aliPayService = require('../service/AliPayService.js');
let taoBaoService = require('../service/TaoBaoService.js');
let wyMusicService = require('../service/WYMusicService.js');
let pddService = require('../service/PDDService.js');
let aDriveService = require('../service/ADriveService.js');
let himalayanService = require('../service/HimalayanService.js');
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
        // 停止其他任务
        deviceService.stopOtherJob();
        // 清除后台任务
        deviceService.clearBackground();
    },

    /**
     * 入口
     */
    mainJob: function () {
        if (!deviceService.appExists("支付宝")) {
            return;
        }
        log("======mainJob start======");
        this.beforeOpt();
        // 允许截图
        deviceService.allowScreenCapture();
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
        // 允许截图
        deviceService.allowScreenCapture();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 收集能量雨
        this.loopEnergyRain(0);
        log("======energyRainJob end======");
    },

    /**
     * 星星球任务
     */
    rescueChicken: function () {
        log("======starBallJob start======");
        this.beforeOpt();
        // 允许截图
        deviceService.allowScreenCapture();
        // 启动支付宝
        deviceService.launch("支付宝");
        // 加载图片
        let imageObj = aliPayService.initRescueChickenImg();
        // 打排球
        this.rescueChickenMission(0, imageObj);
        log("======starBallJob end======");
    },

    /**
     * 营救小鸡
     */
    rescueChickenMission: function (count, imageObj) {
        // 切换账号
        aliPayService.switchAccount(accountList[count % accountList.length].userAccount);
        // 打开蚂蚁庄园
        aliPayService.launchSubApp("蚂蚁庄园");
        // 广告
        deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
        deviceService.comboTextClick(["立即领取", "去收取"], 2000);
        log("营救小鸡");
        // 运动会
        deviceService.clickRate(1300 / 1440, 1100 / 3200, 3000);
        // 营救小鸡
        deviceService.combinedClickText("营救小鸡", 8000);
        // 消除营救
        deviceService.clickRate(720 / 1440, 2600 / 3200, 8000);
        // 解锁盒子
        for (let i = 0; i < 2; i++) {
            deviceService.clickImage(imageObj.unlockBox, 500);
            aliPayService.swipeViewTask(35000);
            deviceService.clickRate(1295 / 1440, 230 / 3200, 1000);
        }
        for (let i = 0; i < 4500; i++) {
            let index = i % 9;
            for (let j = 0; j < 3; j++) {
                if (deviceService.imageExist(imageObj["needScrew" + index + "_" + j])) {
                    for (let k = 0; k < 3; k++) {
                        deviceService.clickAreaImage(imageObj["offerScrew" + index + "_" + k], 0, 910, 200);
                    }
                }
            }
            // 广告复活
            if (deviceService.imageExist(imageObj.revive)) {
                deviceService.clickRate(720 / 1440, 2100 / 3200, 100);
                aliPayService.swipeViewTask(35000)
                deviceService.clickRate(1295 / 1440, 230 / 3200, 100);
            }
            // 结束跳出
            if (deviceService.imageExist(imageObj.finish)) {
                break;
            }
        }
        // 回到小鸡
        aliPayService.closeSubApp();
        // 回到首页
        aliPayService.closeSubApp();
        // 计数
        count++;
        if (count < accountList.length) {
            this.rescueChickenMission(count, imageObj);
        } else {
            // 复原账号
            aliPayService.switchAccount(accountList[0].userAccount);
            this.afterOpt();
        }
        log("======rescueChicken end======");
    },


    /**
     * 循环能量雨
     */
    loopEnergyRain: function (count) {
        // 切换账号
        aliPayService.switchAccount(accountList[count % accountList.length].userAccount);
        // 打开蚂蚁森林
        aliPayService.launchSubApp("蚂蚁森林");
        // 关闭弹框
        deviceService.comboTextClick(["关闭", "知道了"], 1000);
        // 点击“奖励”
        deviceService.clickRate(585 / 1440, 2100 / 3200, 2000);
        // 签到领取活力值、知道了、立即领取、打卡
        deviceService.comboTextClick(["领取", "知道了", "立即领取", "立即领取", "去打卡"], 800);
        // 可以能量雨才操作
        if (text("玩一场能量雨").findOne()) {
            deviceService.clickNearBy("玩一场能量雨", "去拯救", 10000);
            deviceService.clickNearBy("玩一场能量雨", "去赠送", 10000);
            deviceService.clickNearBy("玩一场能量雨", "去看看", 10000);
            // 收能量
            this.takeEnergyRain(accountList[(count + 1) % accountList.length].userName, false);
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
    takeEnergyRain: function (nextUsername, vibrateSwitchOff) {
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
        if (text("立即开启").exists()) {
            text("立即开启").findOne().click();
            sleep(2000);
        }
        if (text("开启能量拯救之旅").exists()) {
            text("开启能量拯救之旅").findOne().click();
            sleep(3000);
        }
        while (true) {
            for (let i = 1; i < 8; i++) {
                press(deviceWidth / 8 * i, deviceHeight / 10, 10);
            }
            if (className("android.view.View").text("恭喜获得").exists() || className("android.widget.TextView").text("恭喜获得").exists()) {
                break;
            }
        }
        sleep(1800);
        if (text("再来一次").exists()) {
            deviceService.combinedClickText("再来一次", 800);
            this.takeEnergyRain(nextUsername, true);
        }
        if (text("送TA机会").exists()) {
            // 只有一个账号
            if (accountList.length == 1) {
                deviceService.combinedClickText("送TA机会", 800);
                this.takeEnergyRain(nextUsername, true);
            } else if (text(nextUsername).exists()) {
                deviceService.clickNearBy(nextUsername, "送TA机会", 800);
                this.takeEnergyRain(nextUsername, true);
            } else {
                deviceService.combinedClickText("更多好友", 2500);
                deviceService.clickBrotherIndex(nextUsername, 1, 500);
                this.takeEnergyRain(nextUsername, true);
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
        let count = 0;
        while (count < 5) {
            deviceService.comboTextClick(["还款", "我知道了", "去还款"], 5000);
            // 点击还款金额输入
            click(deviceWidth / 2, deviceHeight / 24 * 7);
            sleep(800);
            // 设置金额
            deviceService.comboTextClick([".", "0", "1", "确认"], 80);
            sleep(2000);
            // 立即还款
            click(deviceWidth / 2, deviceHeight / 100 * 55);
            sleep(5000);
            // 立即支付
            click(deviceWidth / 2, deviceHeight / 100 * 90);
            sleep(5000);
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
        if (!"23013RK75C" == device.model) {
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
        if (!"23013RK75C" == device.model) {
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
        // 收集能量雨
        this.sendOutTools(0);
        this.afterOpt();
        log("======giveToolJob end======");
    },

    /**
     * 验证码任务
     */
    verifyJob: function () {
        this.mainJob()
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
        deviceService.comboTextClick(["查看更多好友", "王明"], 2000);
        deviceService.clickRate(1120 / 1440, 2475 / 3200, 1800);
        let finish = false;
        while (!finish) {
            if (text("赠送").exists()) {
                deviceService.comboTextClick(["赠送", "赠送"], 1000);
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
                aliPayService.clickCoord("plantWheat");
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
        // 允许截图
        deviceService.allowScreenCapture();
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
        if ("23013RK75C" == device.model) {
            toastLog("88VIP抽茅台");
            // 淘宝
            deviceService.launch("淘宝");
            // 时间
            sleep(3000);
            deviceService.combinedClickDesc("88VIP", 5000);
            deviceService.clickImage(images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/taobao/立即抢.png"), 3000);
        }
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

