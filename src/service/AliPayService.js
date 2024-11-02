// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

// 图片路径
let imagePath = {
    "chickenFodder": images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/chicken-fodder.png"), // 蚂蚁庄园-喂食饲料
    "chickenReward": images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/chicken-reward.png"), // 蚂蚁庄园-打赏喂食
    "chickenSleep": images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/chicken-sleep.png"), // 蚂蚁庄园-小鸡睡觉
    "chickenSleep1": images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/chicken-sleep1.png"), // 蚂蚁庄园-小鸡睡觉
};
// 用户配置
let userConfig = {};

module.exports = {

    /**
     * 切换账号
     * 前提：当前页面是支付宝首页
     * @param {string} account 账号
     */
    switchAccount: function (account) {
        log("======切换账号>>>>>>" + account + "======");
        // 我的
        deviceService.combinedClickText("我的", 2000);
        // 当前账号已经是需要的账号
        if (className("android.widget.TextView").text(account).exists()) {
            // 回到首页
            deviceService.combinedClickText("首页", 2000);
        } else {
            // 设置
            deviceService.combinedClickDesc("设置", 2000);
            // 登陆其他账号
            if (className("android.widget.TextView").text("登录其他账号").exists()) {
                className("android.widget.TextView").text("登录其他账号").findOne().click();
                sleep(1800);
            } else {
                deviceService.clickRate(720 / 1440, 2450 / 3200, 1800);
                if (!text("管理名下账号").exists()) {
                    deviceService.combinedClickText("登录其他账号", 1800);
                }
            }
            // 选择账号
            deviceService.combinedClickText(account, 5000);
        }
    },

    /**
     * 清空消息
     */
    clearMsg: function () {
        log("------清空消息------");
        // 我的
        deviceService.combinedClickText("消息", 2000);
        // 一键清除
        deviceService.combinedClickDesc("一键清除", 1000);
        // 首页
        deviceService.combinedClickText("首页", 2000);
    },

    /**
     * 签到
     */
    signIn: function () {
        // 配置不签到
        if ("off" == userConfig.signSwitch || this.laterThan(10, 0)) {
            return;
        }
        toastLog("====== 支付宝签到 ======");
        // 我的
        deviceService.combinedClickText("我的", 2000);
        // 支付宝会员
        deviceService.clickRate(720 / 1440, 715 / 3200, 5000);
        // 关闭广告
        deviceService.combinedClickDesc("关闭", 800);
        // 全部领取积分
        deviceService.combinedClickText("全部领取", 1000);
        // 签到
        deviceService.combinedClickText("每日签到", 10000);
        // 等等机器人验证
        this.robotCheck();
        // 积分任务
        this.scoreMission();
        // 关闭签到
        deviceService.clickDIP("android.widget.FrameLayout", 9, 0, 1000);
        deviceService.clickDIP("android.widget.FrameLayout", 9, 0, 1000);
        // 刷新
        deviceService.swipeDown(device.height / 2);
        sleep(5000);
        // 首页
        deviceService.combinedClickText("首页", 2000);
    },

    /**
     * 机器人验证提醒
     */
    robotCheck: function () {
        log("===== 机器人验证 START =====");
        // 等待滑动加载
        sleep(3000);
        // 尝试次数
        let retryTime = 1;
        // 如果需要验证，则提示
        while (text("向右滑动验证").exists() || text("亲，请拖动下方滑块完成验证").exists()) {
            if (retryTime > 2) {
                // 反馈
                let feedbacks = ["滑动验证码后提示验证失败", "频繁看到该验证码"];
                deviceService.combinedClickText("点我反馈 >", 3000);
                deviceService.combinedClickText(feedbacks[deviceService.getRandomNumber(0, 1)], 1000);
                deviceService.combinedClickText("提交", 5000);
                back();
                sleep(1000);
                break;
            }
            this.slidingVerification();
            retryTime++;
        }
        sleep(3000);
        log("===== 机器人验证 END =====");
    },

    /**
     * 滑动验证
     */
    slidingVerification: function () {
        // 刷新滑块
        deviceService.clickDIP("android.widget.TextView", 13, 0, 1000)
        log("===== 开始滑动 START =====");
        let slideBounds = className("android.widget.Button").text("滑块").exists() ?
            className("android.widget.Button").text("滑块").findOne().bounds()
            : className("android.widget.TextView").text("滑块").findOne().bounds();
        // 最左边X坐标
        let xLeft = slideBounds.centerX();
        let bounds = className("android.widget.TextView").text("向右滑动验证").findOne().bounds();
        let xRight = bounds.right;
        // 分割次数
        let cnt = 3;
        // 高度
        let height = slideBounds.bottom - slideBounds.top;
        // 长度
        let length = xRight - xLeft;
        // 坐标1
        let x1 = xLeft;
        let y1 = deviceService.getRandomNumber(slideBounds.top + height / 4, slideBounds.bottom - height / 4);
        for (let i = 0; i < cnt - 1; i++) {
            // 坐标2
            let x2 = x1 + (length / cnt) + deviceService.getRandomNumber(0, length / (cnt * (cnt - 1)))
            let y2 = deviceService.getRandomNumber(slideBounds.top + height / 4, slideBounds.bottom - height / 4);
            // 滑动
            swipe(x1, y1, x2, y2, deviceService.getRandomNumber(1000, 1500));
            x1 = x2;
            y1 = y2;
        }
        // 最终坐标
        swipe(x1, y1, xRight, deviceService.getRandomNumber(slideBounds.top + height / 4, slideBounds.bottom - height / 4), deviceService.getRandomNumber(700, 800));
        // 等待滑动成功后跳转
        sleep(2000);
        log("===== 开始滑动 END =====");
    },

    /**
     * 积分任务
     */
    scoreMission: function () {
        log("===== 积分任务 START =====");
        let browseTaskList = deviceService.initTaskNameList(userConfig.signBrowseTaskList);
        for (let i = 0; i < 6; i++) {
            for (let i = 0; i < browseTaskList.length; i++) {
                if (className("android.widget.TextView").text(browseTaskList[i]).exists()) {
                    className("android.widget.TextView").text(browseTaskList[i]).findOne().click();
                    sleep(800);
                    deviceService.combinedClickText("去完成", 2000);
                    // 等等机器人验证
                    this.swipeViewTask(18000);
                    back();
                    sleep(3000);
                    if (!text("换一换").exists()) {
                        back();
                        sleep(3000);
                    }
                }
            }
            deviceService.combinedClickText("换一换", 1000);
        }
        log("===== 积分任务 END =====");
    },

    /**
     * 组合combo
     * @param accountInfo
     */
    combo: function (accountInfo) {
        // 加载用户配置
        this.initUserConfig(accountInfo.userName);
        // 清除消息
        this.clearMsg();
        // 签到
        this.signIn();
        // 芭芭农场任务
        this.babaFarmOption();
        // 蚂蚁庄园任务
        this.antFarmOption();
        // 蚂蚁新村任务
        this.antNewVillageOption();
        // 蚂蚁森林任务
        this.antForestOption();
        // 神奇海洋任务
        this.magicSeaOption();
        // 运动任务
        this.sportOption();
    },

    /**
     * 加载用户配置
     */
    initUserConfig: function (userName) {
        let jsonString = files.read("/sdcard/脚本/WmScript/resource/config/user/" + userName + ".json");
        userConfig = JSON.parse(jsonString);
        log("======用户配置 start======");
        log(userConfig);
        log("======用户配置 end======");
    },

    /**
     * 蚂蚁庄园操作
     */
    antFarmOption: function () {
        // 打开蚂蚁庄园
        this.launchSubApp("蚂蚁庄园");
        sleep(5000);
        // 广告
        deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
        // 收取赠送麦子
        deviceService.comboTextClick(["去收取", "立即领取"], 800);
        // 打赏喂食
        deviceService.clickImage(imagePath.chickenReward, 1000);
        // 睡觉广告
        deviceService.clickRate(55 / 1440, 2385 / 3200, 800);
        // 收鸡蛋
        deviceService.clickRate(250 / 1440, 2245 / 3200, 1500);
        // 喂食小鸡
        this.feedChicken();
        // 小鸡日记
        this.chickenDiary();
        // 领饲料任务
        this.chickenTask();
        // 道具使用
        this.chickenTool();
        // 道具使用后可能加速吃完了，再次喂食小鸡
        this.feedChicken();
        // 主号捐蛋
        if ("on" == userConfig.chickenTask.donateEggSwitch) {
            // 捐蛋
            this.donateEgg();
        }
        // 非主号给主号送小麦
        if ("on" == userConfig.chickenTask.plantWheatSwitch) {
            this.plantWheat("王明");
        }
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 小鸡日记
     */
    chickenDiary: function () {
        deviceService.clickRate(1 / 10, 36 / 100, 3800)
        // 贴贴小鸡
        deviceService.clickRate(1 / 2, 95 / 100, 3800)
        if (text("点赞").exists()) {
            text("点赞").click();
            sleep(1000);
        }
        back();
        sleep(2000);
    },

    /**
     * 蚂蚁庄园-道具使用
     */
    chickenTool: function () {
        log("------蚂蚁庄园-道具使用------");
        // 使用道具-加速卡
        this.chickenToolUse("我的道具", "加速卡", "使用道具");
        // 使用道具-新蛋卡
        this.chickenToolUse("我的道具", "新蛋卡", "使用道具");
        // 领取新蛋卡
        this.chickenToolUse("道具任务", "新蛋卡", "立即领奖");
        // 领取篱笆卡
        this.chickenToolUse("道具任务", "篱笆卡", "立即领奖");
    },

    /**
     * 使用小鸡道具
     * toolType - 道具类目：我的道具/道具任务
     * toolName - 道具名称
     */
    chickenToolUse: function (toolType, toolName, useName) {
        log("------蚂蚁庄园-道具-" + toolType + "-" + toolName + "-" + useName);
        // 点击道具
        deviceService.clickRate(1295 / 1440, 900 / 3200, 2000);
        // 选择道具类型
        deviceService.combinedClickText(toolType, 2800);
        // 使用道具
        deviceService.clickNearBy(toolName, useName, 2800);
        deviceService.combinedClickText("立即加速", 2800);
        deviceService.clickDIP("android.widget.TextView", 18, 4, 1000);
        // 使用-未使用道具场景、确认-已使用道具场景、知道了、已使用加速卡时，补充关闭
        deviceService.comboTextClick(["使用", "确认", "知道了", "关闭"], 2800);
    },

    /**
     * 蚂蚁庄园-饲料任务
     */
    chickenTask: function () {
        log("------蚂蚁庄园-饲料任务------");
        // 领饲料
        this.clickCoord("collarFeed");
        // 庄园小课堂
        this.chickenQuestion();
        // 雇佣小鸡
        this.chickenHire();
        // 抽抽乐
        this.happyLottery();
        // 庄园小视频
        this.chickenVideo();
        // 逛一逛
        this.chickenStroll();
        // 会员签到
        this.chickenSign();
        // 小鸡厨房
        this.cookDishes();
        // APP跳转任务
        this.chickenAppJump();
        // 淘宝任务
        this.chickenTaoBao();
        // 浏览任务
        this.chickenBrowse();
        // 鲸探任务
        this.jingTanTask();
        // 小鸡睡觉
        this.chickenSleep();
        // 小鸡乐园
        this.chickenParadise();
        log("------蚂蚁庄园-收取饲料------");
        // 领取饲料
        this.takeFodder();
        // 关闭"领饲料"的弹框
        deviceService.combinedClickText("关闭", 1800);
    },

    /**
     * 领取饲料
     */
    takeFodder: function () {
        // 可以领取标识
        let takeFlag = false;
        // 满载标识
        let fullFlag = false;
        for (let i = 30; i <= 720; i += 30) {
            let fodderList = ["x" + i + "g", "x" + i + "g领取"];
            for (let fodder of fodderList) {
                if (text(fodder).exists()) {
                    takeFlag = true;
                    text(fodder).findOne().click();
                    sleep(1800);
                    // 满了就跳出
                    if (this.checkFodderFull()) {
                        fullFlag = true;
                        break;
                    }
                }
            }
        }
        // 满了，或者如果没有可以收的,跳出
        if (fullFlag || !takeFlag) {
            return;
        }
        this.takeFodder();
    },

    /**
     * 判断是不是装满了
     */
    checkFodderFull: function () {
        if (text("知道了").exists()) {
            text("知道了").findOne().click();
            sleep(800);
            return true;
        }
        if (text("去帮好友喂食").exists()) {
            deviceService.clickDIP("android.view.View", 15, 3, 800);
            deviceService.clickDIP("android.widget.Image", 18, 0, 800);
            return true;
        }
        return false;
    },

    /**
     * 浏览任务
     */
    chickenTaoBao: function () {
        // 所有跳转淘宝任务
        let taoBaoTaskList = ["去逛一逛淘宝芭芭农场", "去逛一逛淘宝摇现金活动", "去逛一逛淘宝视频", "去淘宝签到逛一逛"];
        if ("on" == userConfig.chickenTask.taobaoSwitch) {
            taoBaoTaskList.push("去逛一逛淘金币小镇");
        }
        // 遍历任务
        for (let i = 0; i < taoBaoTaskList.length; i++) {
            if (text(taoBaoTaskList[i]).exists() && text(taoBaoTaskList[i]).findOne().parent().findOne(text("去完成"))) {
                // 需要做任务
                log("------饲料任务-" + taoBaoTaskList[i] + "------");
                deviceService.clickNearBy(taoBaoTaskList[i], "去完成", 10000);
                // 等等机器人验证
                this.robotCheck();
                deviceService.combinedClickText("立即签到", 1000);
                if (text("账号绑定").exists()) {
                    back();
                    sleep(8000);
                }
                app.launchApp("支付宝");
                sleep(2000);
                if (text("打开淘宝").exists()) {
                    back();
                    sleep(800);
                }
            }
        }
    },

    /**
     * 浏览任务
     */
    chickenBrowse: function () {
        // 所有浏览任务
        let browseTaskList = userConfig.chickenBrowseTaskList;
        for (let i = 1; i <= 12; i++) {
            browseTaskList.push(i + "月数字公仔上新啦");
        }
        // 遍历任务
        for (let i = 0; i < browseTaskList.length; i++) {
            if (text(browseTaskList[i]).exists() && text(browseTaskList[i]).findOne().parent().findOne(text("去完成"))) {
                // 需要做任务
                log("------饲料任务-" + browseTaskList[i] + "------");
                deviceService.clickNearBy(browseTaskList[i], "去完成", 5000);
                back();
                sleep(800);
                if (!text(browseTaskList[i]).exists()) {
                    back();
                    sleep(800);
                }
            }
        }
    },

    /**
     * 鲸探任务
     */
    jingTanTask: function () {
        if ("on" == userConfig.chickenTask.jingTanSwitch) {
            if (text("去鲸探喂鱼集福气").exists() && text("去鲸探喂鱼集福气").findOne().parent().findOne(text("去喂鱼"))) {
                // 需要做任务
                log("------饲料任务-去鲸探喂鱼集福气------");
                deviceService.clickNearBy("去鲸探喂鱼集福气", "去喂鱼", 1000);
                text("一个小正经的池塘").waitFor();
                sleep(2000);
                for (let i = 5; i > 0; i--) {
                    deviceService.combinedClickText("鱼食(" + i + "/5)", 2000);
                    deviceService.combinedClickText("继续喂鱼", 500);
                }
                for (let i = 0; i < 88; i++) {
                    deviceService.clickRate(0.5, 0.5, 200);
                }
                text("敲木鱼").click();
                sleep(500);
                for (let i = 0; i < 88; i++) {
                    deviceService.clickRate(0.5, 0.5, 200);
                }
                text("盘珠子").click();
                sleep(500);
                for (let i = 0; i < 88; i++) {
                    swipe(device.width / 2, device.height / 2, device.width / 2, device.height, 200);
                }

                back();
                sleep(2000);
            }
        }
    },

    /**
     * APP跳转任务
     */
    chickenAppJump: function () {
        // 所有APP跳转任务
        let appJumpTaskList = userConfig.chickenAppJumpList;
        // 遍历任务
        for (let i = 0; i < appJumpTaskList.length; i++) {
            if (text(appJumpTaskList[i]).exists() && text(appJumpTaskList[i]).findOne().parent().findOne(text("去完成"))) {
                log("------饲料任务-" + appJumpTaskList[i] + "------");
                deviceService.clickNearBy(appJumpTaskList[i], "去完成", 8000);
                app.launchApp("支付宝");
                sleep(1000);
                back();
                sleep(800);
                if (!text(appJumpTaskList[i]).exists()) {
                    // 领饲料
                    this.clickCoord("collarFeed");
                }
            }
        }
    },

    /**
     * 去支付宝会员签到
     */
    chickenSign: function () {
        if (text("去支付宝会员签到").exists() && text("去支付宝会员签到").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-会员签到------");
            deviceService.clickNearBy("去支付宝会员签到", "去完成", 3000);
            back();
            sleep(800);
            back();
            sleep(1000);
        }
    },

    /**
     * 庄园小课堂
     */
    chickenQuestion: function () {
        if (text("庄园小课堂").exists() && text("庄园小课堂").findOne().parent().findOne(text("去答题"))) {
            log("------饲料任务-庄园小课堂------");
            deviceService.clickNearBy("庄园小视频", "去答题", 2000);
            text("题目来源 - 答答星球").waitFor();
            try {
                let queryDate = deviceService.formatDate(new Date());
                let response = http.get("http://110.40.48.222:29343/entertainment/alipay/queryQuestionAnswer/" + queryDate.formatDay);
                sleep(1000);
                if (response.statusCode != 200) {
                    log("请求失败: " + response.statusCode + " " + response.statusMessage);
                } else {
                    let resultList = response.body.json();
                    for (let i = 0; i < resultList.length; i++) {
                        if (text(resultList[i]).exists()) {
                            text(resultList[i]).findOne().click();
                            sleep(1000);
                        }
                    }
                }
            } catch (err) {
                log("请求异常", err);
            }
            back();
            sleep(1000);
        }
    },

    /**
     * 雇佣小鸡
     */
    chickenHire: function () {
        if (text("雇佣小鸡拿饲料").exists() && text("雇佣小鸡拿饲料").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-雇佣小鸡拿饲料------");
            deviceService.clickNearBy("雇佣小鸡拿饲料", "去完成", 2000);
            if (className("android.widget.Image").depth(14).indexInParent(1).exists()) {
                // 奖励翻倍父控件
                let doubleReward = className("android.widget.Image").depth(14).indexInParent(1).findOne().parent();
                // 雇佣并通知
                if (depth(doubleReward.depth()).indexInParent(doubleReward.depth() + 2).exists()) {
                    depth(doubleReward.depth()).indexInParent(doubleReward.depth() + 2).findOne().click();
                }
            } else {
                deviceService.combinedClickText("雇佣并通知", 1000);
            }
            deviceService.combinedClickText("不通知TA", 1000);
            this.closeSubApp();
            sleep(1000);
        }
    },

    /**
     * 抽抽乐
     */
    happyLottery: function () {
        let lotteryName = "【抽抽乐】秋日限定装扮来啦";
        if (text(lotteryName).exists() && text(lotteryName).findOne().parent().findOne(text("去完成"))) {
            // 任务
            this.lotteryTask(lotteryName);
            // 抽奖
            for (let i = 24; i > 0; i--) {
                deviceService.combinedClickText("还剩" + i + "次机会", 6000);
                deviceService.combinedClickText("知道啦", 1000);
            }
            // 回退到任务
            back();
            sleep(1000);
        }
    },

    /**
     * 抽抽乐任务
     */
    lotteryTask: function (lotteryName) {
        deviceService.clickNearBy(lotteryName, "去完成", 5000);
        // 每日签到 
        deviceService.clickNearBy("每日签到 ", "领取", 3000);
        deviceService.clickNearBy("每日签到 ", "领取", 3000);
        // 兑换饲料
        for (let i = 0; i < 2; i++) {
            if (text("消耗饲料换机会 (" + i + "/2)").exists()) {
                deviceService.clickNearBy("消耗饲料换机会 (" + i + "/2)", "去完成", 2000);
                deviceService.combinedClickText("确认兑换", 3500)
            }
        }
        // 逛一逛
        for (let i = 0; i < 3; i++) {
            if (text("去杂货铺逛一逛 (" + i + "/3)").exists()) {
                deviceService.clickNearBy("去杂货铺逛一逛 (" + i + "/3)", "去完成", 5000);
                this.swipeViewTask(18000);
                back();
                sleep(1000);
                deviceService.clickNearBy("去杂货铺逛一逛 (" + (i + 1) + "/3)", "领取", 5000);
            }
        }
        // 数字藏品
        if (text("立得「丹枫如火」稀有装扮 ").exists() && text("立得「丹枫如火」稀有装扮 ").findOne().parent().findOne(text("去完成"))) {
            deviceService.clickNearBy("立得「丹枫如火」稀有装扮 ", "去完成", 8000);
            back();
            sleep(1000);
            deviceService.clickNearBy("立得「丹枫如火」稀有装扮 ", "领取", 5000);
        }
        // 数字藏品
        if (text("买数字藏品 立得稀有装扮 ").exists() && text("买数字藏品 立得稀有装扮 ").findOne().parent().findOne(text("去完成"))) {
            deviceService.clickNearBy("买数字藏品 立得稀有装扮 ", "去完成", 8000);
            back();
            sleep(1000);
            deviceService.clickNearBy("买数字藏品 立得稀有装扮 ", "领取", 5000);
        }
    },

    /**
     * 逛一逛任务
     */
    chickenStroll: function () {
        if (text("去杂货铺逛一逛").exists() && text("去杂货铺逛一逛").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-去杂货铺逛一逛------");
            deviceService.clickNearBy("去杂货铺逛一逛", "去完成", 5000);
            // 等等机器人验证
            this.swipeViewTask(18000);
            back();
            sleep(1000);
        }
    },

    /**
     * 庄园小视频
     */
    chickenVideo: function () {
        if (text("庄园小视频").exists() && text("庄园小视频").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-庄园小视频------");
            deviceService.clickNearBy("庄园小视频", "去完成", 2000);
            deviceService.swipeUp(device.height / 2)
            sleep(18000);
            back();
            sleep(1000);
        }
    },

    /**
     * 小鸡睡觉
     */
    chickenSleep: function () {
        if (this.laterThan(20, 0) && text("让小鸡去睡觉").exists() && text("让小鸡去睡觉").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-小鸡睡觉------");
            deviceService.clickNearBy("让小鸡去睡觉", "去完成", 5000);
            // 点击睡觉
            deviceService.clickRate(1 / 2, 1 / 3, 800);
            // 去睡觉
            deviceService.combinedClickText("去睡觉", 800);
            deviceService.combinedClickText(userConfig.chickenTask.sleepPlace, 800);
            // 后退到“任务”
            if (text("饲料不足，去做任务").exists()) {
                deviceService.combinedClickText("关闭", 800);
            }
            // 通知提醒
            deviceService.combinedClickText("取消", 800);
            back();
            sleep(800);

        }
    },

    /**
     * 小鸡乐园
     */
    chickenParadise: function () {
        if (text("逛一逛小鸡乐园").exists() && text("逛一逛小鸡乐园").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-逛一逛小鸡乐园------");
            deviceService.clickNearBy("逛一逛小鸡乐园", "去完成", 8000);
            // 关闭小鸡乐园
            deviceService.combinedClickText("关闭", 1000);
            // 领饲料
            this.clickCoord("collarFeed");
        }
    },

    /**
     * 做菜
     */
    cookDishes: function () {
        if (text("小鸡厨房").exists() && text("小鸡厨房").findOne().parent().findOne(text("去完成"))) {
            log("------饲料任务-小鸡厨房------");
            deviceService.clickNearBy("小鸡厨房", "去完成", 3500);
            // 厨房垃圾
            deviceService.clickRate(1245 / 1440, 1280 / 3200, 2800);
            // 关闭弹窗
            deviceService.combinedClickText("关闭", 800);
            // 领取食材
            deviceService.clickRate(1270 / 1440, 2230 / 3200, 2800);
            // 我知道了、关闭弹窗
            deviceService.comboTextClick(["我知道了", "关闭", "取消"], 800);
            // 爱心食材店
            deviceService.clickRate(1 / 7, 35 / 100, 1800)
            // 领10g食材
            deviceService.combinedClickText("领10g食材", 800);
            // 后退
            back();
            sleep(1000);
            // 如果触发连续后退
            if (text("小鸡厨房").exists()) {
                deviceService.clickNearBy("小鸡厨房", "去完成", 3500);
            }
            sleep(800);
            for (let i = 0; i < 3; i++) {
                // 做美食
                deviceService.clickRate(1030 / 1440, 3010 / 3200, 6000);
                // 关闭弹窗
                deviceService.combinedClickText("关闭", 800);
            }
            // 退到任务
            back();
            sleep(1000);
        }
    },

    /**
     * 捐蛋
     */
    donateEgg: function () {
        if (this.laterThan(7, 0)) {
            return;
        }
        // 点击去捐蛋
        deviceService.clickRate(885 / 1440, 2975 / 3200, 1500);
        text("去捐蛋").waitFor();
        deviceService.combinedClickText("去捐蛋", 5000);
        text("立即捐蛋").waitFor();
        deviceService.comboTextClick(["立即捐蛋", "立即捐蛋"], 8000);
        sleep(10000);
        back();
        sleep(1000);
        if (!text("去捐蛋").exists()) {
            // 回到庄园
            back();
            sleep(1000);
        }
        deviceService.combinedClickText("关闭", 800);
    },

    /**
     * 喂食小鸡
     */
    feedChicken: function () {
        // 如果小鸡睡觉了，不喂食
        if (deviceService.imageExist(imagePath.chickenSleep) || deviceService.imageExist(imagePath.chickenSleep1)) {
            return;
        }
        // 如果是其他零食，没有显示鸡饲料
        while (!deviceService.imageExist(imagePath.chickenFodder)) {
            // 点击小鸡饲料
            this.clickChickenFodder();
        }
        // 零食吃完，吃饲料
        this.clickChickenFodder();
    },

    /**
     * 点击小鸡饲料
     */
    clickChickenFodder: function () {
        // 点击喂食饲料
        deviceService.clickRate(1255 / 1440, 2970 / 3200, 800);
        // 小鸡不在家，领回小鸡
        this.takeBackChicken();
        // 关闭饲料不足弹窗
        deviceService.combinedClickText("取消", 1800);
    },

    /**
     * 领回小鸡
     */
    takeBackChicken: function () {
        if (className("android.widget.Button").text("找小鸡").exists()) {
            className("android.widget.Button").text("找小鸡").findOne().click();
            sleep(8000);
            if (className("android.widget.Button").depth(18).indexInParent(2).exists()) {
                // 除草场景
                deviceService.clickDIP("android.widget.Button", 18, 2, 800);
                back();
                sleep(5000);
            } else {
                // 找小鸡场景
                deviceService.clickRate(550 / 1440, 2188 / 3200, 800);
                // 下次再说
                deviceService.combinedClickText("下次再说", 800);
                // 确认带小鸡回家
                deviceService.combinedClickText("确认", 5000);
                // 点击右边
                deviceService.clickRate(980 / 1440, 2188 / 3200, 800);
                // 下次再说
                deviceService.combinedClickText("下次再说", 800);
                // 确认带小鸡回家
                deviceService.combinedClickText("确认", 5000);
            }
        }
    },

    /**
     * 给好友种麦子
     * @param {string} friendName 好友名称
     */
    plantWheat: function (friendName) {
        // 好友
        deviceService.clickRate(160 / 1440, 2980 / 3200, 3000);
        // 点击好友
        deviceService.combinedClickText(friendName, 5000);
        // 种麦子
        this.clickCoord("plantWheat");
        // 确认
        deviceService.combinedClickText("确认", 2800);
        // 回到好友
        back();
        sleep(1000);
        // 回到庄园
        deviceService.combinedClickText("关闭", 800);
    },

    /**
     * 点击小鸡饲料
     */
    initRescueChickenImg: function () {
        let imageObj = {};
        imageObj["unlockBox"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/rescue/解锁盒子.png");
        imageObj["revive"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/rescue/免费复活.png");
        imageObj["finish"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/rescue/营救成功.png");
        let colorList = ["橙", "灰", "粉", "红", "黄", "紫", "绿", "蓝", "棕",]
        let index = 0;
        for (let color of colorList) {
            for (let i = 0; i < 3; i++) {
                imageObj["needScrew" + index + "_" + i] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/rescue/" + color + i + ".png");
                imageObj["offerScrew" + index + "_" + i] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/chicken/rescue/" + color + "螺丝" + i + ".png");
            }
            index++;
        }
        return imageObj;
    },

    /**
     * 芭芭农场操作
     */
    babaFarmOption: function () {
        if ("off" == userConfig.babaFarmSwitch) {
            return;
        }
        // 打开芭芭农场
        this.launchSubApp("芭芭农场");
        // 如果没有开通，跳过
        if (className("android.widget.Button").text("同意须知并开通支付宝芭芭农场").exists() || className("android.view.View").text("1分钱领一箱水果").exists()) {
            // 回到首页
            this.closeSubApp();
            return;
        }
        // 通知申请
        deviceService.combinedClickText("取消", 2000);
        // 领取肥料
        deviceService.clickRate(1265 / 1440, 2325 / 3200, 800);
        // 通知申请、关闭明日可领取、通知申请
        deviceService.comboTextClick(["取消", "关闭","取消"], 2000);
        // 施肥
        deviceService.clickRate(720 / 1440, 2585 / 3200, 1000);
        // 好的
        deviceService.comboTextClick(["好的", "关闭","取消"], 800);
        // 收食材
        deviceService.clickRate(175 / 1440, 1960 / 3200, 3600);
        if (className("android.widget.Button").text("去小鸡厨房").exists()) {
            deviceService.combinedClickText("关闭", 800);
        } else {
            deviceService.combinedClickText("知道了", 800);
            // 回到芭芭农场
            back();
            sleep(1000);
        }
        // 立即领奖
        deviceService.comboTextClick(["立即领奖", "立即领取", "领取", "领取", "关闭", "取消"], 2000);
        // 做任务
        this.babaFarmTask();
    },

    /**
     * 做任务
     */
    babaFarmTask: function () {
        // 点击“领肥料”
        deviceService.combinedClickText("任务列表", 2000);
        // 如果可以领取饲料
        deviceService.comboTextClick(["领取", "我知道了", "领取", "知道了", "领取", "领取", "取消"], 1000);
        // 浏览任务
        this.babaFarmBrowse();
        // 逛逛淘宝芭芭农场
        if ("on" == userConfig.babaFarmTask.gotoTBFarmSwitch) {
            deviceService.clickBrotherIndex(" 逛逛淘宝芭芭农场 (0/1)", 2, 6000);
            app.launchApp("支付宝");
        }
        deviceService.combinedClickText("关闭", 1000);
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 芭芭农场的浏览任务
     */
    babaFarmBrowse: function () {
        // 所有浏览任务
        let browseTaskList = deviceService.initTaskNameList(userConfig.babaBrowseTaskList);
        log("芭芭农场的浏览任务 start");
        // 遍历任务
        for (let i = 0; i < browseTaskList.length; i++) {
            if (text(browseTaskList[i]).exists()) {
                deviceService.clickBrotherIndex(browseTaskList[i], 2, 5000);
                if (className("android.widget.TextView").text("去浏览").exists()) {
                    className("android.widget.TextView").text("去浏览").findOne().click();
                    this.swipeViewTask(16000);
                }
                this.swipeViewTask(18000);
                back();
                sleep(800);
            }
        }
        log("芭芭农场的浏览任务 end");
    },

    /**
     * 下滑浏览任务
     */
    swipeViewTask: function (keepTime) {
        // 等等机器人验证
        this.robotCheck();
        let duration = 0;
        while (duration < keepTime) {
            gesture(3000, [device.width / 2, device.height / 4 * 3], [device.width / 2, device.height / 4], [device.width / 2, device.height / 4 * 3]);
            sleep(3000);
            duration += 3000;
        }
    },

    /**
     * 蚂蚁新村操作
     */
    antNewVillageOption: function () {
        // 打开蚂蚁新村
        this.launchSubApp("蚂蚁新村");
        // 捐币弹框
        deviceService.clickDIP("android.view.View", 14, 0, 800);
        // 收豆子
        deviceService.clickRate(740 / 1440, 1660 / 3200, 2000);
        // 通知申请
        deviceService.combinedClickText("取消", 2000);
        if ("on" == userConfig.antNewVillageTask.takeAwayVendors) {
            // 请走TA
            click(720, 2595);
            sleep(1800);
            deviceService.comboTextClick(["请走TA", "请走TA"], 1000);
            // 关闭弹框
            this.clickCoord("closeVillageDialog");
            // 请走TA
            click(270, 2310);
            sleep(1800);
            deviceService.comboTextClick(["请走TA", "请走TA"], 1000);
            // 关闭弹框
            this.clickCoord("closeVillageDialog");
        }
        // 摆摊
        deviceService.clickRate(1195 / 1440, 2967 / 3200, 1800);
        // 全部收摊、确认收摊、随机摆摊、我知道了
        deviceService.comboTextClick(["全部收摊", "确认收摊", "随机摆摊", "返回新村"], 1800);
        // 关闭弹框
        this.clickCoord("closeVillageDialog");
        // 加速产币
        deviceService.clickRate(720 / 1440, 2960 / 3200, 1000);
        // 可以领取农民就领取
        deviceService.combinedClickText("领取", 800);
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 蚂蚁森林操作
     */
    antForestOption: function () {
        // 打开蚂蚁新村
        this.launchSubApp("蚂蚁森林");
        let imageObj = {};
        imageObj["newBook"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/forest/开启新图鉴.png");
        imageObj["lottery"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/forest/抽取物种卡.png");
        imageObj["gift"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/forest/赠送能量.png");
        imageObj["revive"] = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/forest/forest-revive.png");

        // 开启新图鉴
        if (deviceService.imageExist(imageObj.newBook)) {
            deviceService.clickImage(imageObj.newBook, 3000);
            back();
            sleep(1000);
        }
        // 抽取物种卡
        if (deviceService.imageExist(imageObj.lottery)) {
            deviceService.clickImage(imageObj.lottery, 3000);
            back();
            sleep(1000);
        }
        // 赠送能量
        while (deviceService.imageExist(imageObj.gift)) {
            deviceService.clickImage(imageObj.gift, 800);
        }
        if ("on" == userConfig.antForestTask.takeEnergySwitch) {
            // 主账号收能量
            this.takeEnergy();
        } else {
            // deviceService.clickRate(85 / 100, 24 / 100, 100);
            // 小号接受复活能量
            deviceService.clickImage(imageObj.revive, 3000);
            // 立即收取
            deviceService.combinedClickText("立即收取", 1000);
        }
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 给指定朋友浇水
     * @param {string} friendName 朋友名称
     */
    waterFriend: function (friendName) {
        // 上滑
        deviceService.swipeUp(device.height / 2);
        deviceService.swipeUp(device.height / 2);
        // 新版本收能量
        if (text("查看更多好友").exists()) {
            text("查看更多好友").findOne().click();
            sleep(2000);
        }
        deviceService.combinedClickText(friendName, 5000);
        for (let i = 0; i < 3; i++) {
            // 点击浇水
            deviceService.clickRate(1315 / 1440, 2474 / 3200, 1000);
            // 选择66g
            deviceService.combinedClickText("66克", 600);
            // 浇水
            deviceService.combinedClickText("浇水送祝福", 4500);
        }
        // 回退到排行榜
        back();
        sleep(800);
        // 回退到蚂蚁森林
        back();
        sleep(800);
    },

    /**
     * 收/偷能量
     */
    takeEnergy: function () {
        // 关闭弹框
        deviceService.combinedClickText("关闭", 1000);
        toastLog("====== 开始找能量 ======");
        // 标记是否偷完
        let finishFlag = false;
        let selfFlag = true;
        this.useTools();
        while (!finishFlag) {
            // 取消订阅弹框
            deviceService.combinedClickText("取消", 2000);
            // 收能量
            this.energyClick(selfFlag);
            selfFlag = false;
            // 找能量
            deviceService.clickRate(1315 / 1440, 2115 / 3200, 3000);
            // 如果找完了，返回森林
            if (text("返回森林首页").exists() || text("返回我的森林").exists() || text("返回蚂蚁森林 >").exists()) {
                deviceService.clickDIP("android.view.View", 14, 9, 1000);
                finishFlag = true;
            }
        }
        toastLog("====== 结束找能量 ======");
    },

    /**
     * 判断是否需要使用双击
     */
    useTools: function () {
        // 背包
        deviceService.clickRate(370 / 1440, 2100 / 3200, 1000);
        // 7点到9点，使用加速器
        if (this.laterThan(7, 0) && this.earlierThan(8, 0)) {
            if (text("限时加速器").exists()) {
                text("限时加速器").findOne().parent().findOne(text("使用")).click();
                sleep(1000);
                deviceService.combinedClickText("立即使用", 800);
                deviceService.combinedClickText("知道了", 800);
            } else if (text("时光加速器").exists()) {
                text("时光加速器").findOne().parent().findOne(text("使用")).click();
                sleep(1000);
                deviceService.combinedClickText("立即使用", 800);
                deviceService.combinedClickText("知道了", 800);
            }
        }
        // 0点到1点，7点到8点。使用双击卡
        if (this.earlierThan(1, 0) || (this.laterThan(7, 0) && this.earlierThan(8, 0))) {
            // 使用能量双击卡
            if (text("限时双击卡").exists()) {
                // 使用限时能量雨机会
                text("限时双击卡").findOne().parent().findOne(text("使用")).click();
                sleep(1000);
                deviceService.combinedClickText("立即使用", 800);
            } else if (text("能量双击卡").exists()) {
                // 使用限时能量雨机会
                text("能量双击卡").findOne().parent().findOne(text("使用")).click();
                sleep(1000);
                deviceService.combinedClickText("立即使用", 800);
            }
        }
        // 关闭背包
        deviceService.combinedClickText("关闭", 1600);
    },

    /**
     * 收能量的点击操作
     */
    energyClick: function (selfFlag) {
        // 自己不能一键收，点击收取
        if (selfFlag) {
            // 巡护动物能量
            press(320, 1665, 10);
            sleep(100);
            this.clearForestDialog();
            for (let i = 0; i < 2; i++) {
                // 左下
                press(260, 964, 10);
                sleep(100);
                this.clearForestDialog();
                // 右下
                press(1180, 964, 10);
                sleep(100);
                this.clearForestDialog();
                // 左中
                press(444, 864, 10);
                sleep(100);
                this.clearForestDialog();
                // 右中
                press(996, 864, 10);
                sleep(100);
                this.clearForestDialog();
                // 左上
                press(628, 764, 10);
                sleep(100);
                this.clearForestDialog();
                // 右上
                press(812, 764, 10);
                sleep(100);
                this.clearForestDialog();
            }
        } else {
            // 别人的用一键收
            let oneTake = images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/forest/一键收.png");
            while (deviceService.imageExist(oneTake)) {
                deviceService.clickImage(oneTake, 800);
            }
            // 种植礼包
            deviceService.clickImage(images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/forest/gift.png"), 2000);
            deviceService.combinedClickText("知道了", 2000);
            // 周一，14点前不帮别人激活
            let now = new Date();
            if (1 == now.getDay() && this.earlierThan(14, 0) && !this.isSubAccount()) {
                return;
            }
            // 8:00 -22:00 才能复活能量
            if (this.laterThan(22, 0) || this.earlierThan(8, 0)) {
                return;
            }
            // 补充点1
            press(720, 580, 10);
            sleep(800);
            this.clearForestDialog();
            // 补充点2
            press(536, 580, 10);
            sleep(800);
            this.clearForestDialog();
            // 补充点3
            press(352, 580, 10);
            sleep(800);
            this.clearForestDialog();
        }
    },

    /**
     * 判断是否是小号
     */
    isSubAccount: function () {
        let subAccountList = ["olly", "coco", "wm01", "wm02", "wm03", "wm04"];
        for (let i = 0; i < subAccountList.length; i++) {
            if (text(subAccountList[i] + "的蚂蚁森林").exists()) {
                return true;
            }
        }
        return false;
    },

    /**
     * 神奇海洋操作
     */
    magicSeaOption: function () {
        this.launchSubApp("神奇海洋");
        // 知道了
        deviceService.combinedClickText("知道了", 2000);
        // 收垃圾
        this.clickCoord("takeGarbage");
        // 清理弹框
        this.clearSeaDialog();
        // 回到我的海洋
        if (text("回到我的海洋").exists()) {
            text("回到我的海洋").click();
        }
        while (true) {
            // 找拼图
            deviceService.clickRate(1325 / 1440, 2500 / 3200, 5000);
            if (text("回到我的海洋").exists()) {
                text("回到我的海洋").click();
                sleep(800);
                break;
            }
            // 收垃圾
            this.clickCoord("takeGarbage");
            // 清理弹框
            this.clearSeaDialog();
        }
        // 奖励
        deviceService.clickRate(1240 / 1440, 3000 / 3200, 2000);
        // 去看看
        while (text("去看看").exists()) {
            // 立即领取
            deviceService.combinedClickText("去看看", 5000);
            this.swipeViewTask(18000)
            back();
            sleep(1000);
        }
        // 看视频
        while (text("去逛逛").exists() && "on" == userConfig.magicSeaTask.jumpAppSwitch) {
            // 立即领取
            deviceService.combinedClickText("去逛逛", 5000);
            this.swipeViewTask(18000)
            app.launchApp("支付宝");
            sleep(1000);
            if (!text("立即领取").exists()) {
                back();
                sleep(1000);
            }
        }
        while (text("立即领取").exists()) {
            // 立即领取
            deviceService.combinedClickText("立即领取", 2000);
            // 收下
            deviceService.combinedClickText("收下", 2000);
        }
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 取消弹框
     * @returns
     */
    clearSeaDialog: function () {
        // 所有浏览任务
        let dialogArray = ["发送并重抽拼图", "清理掉", "收下", "知道了", "欢迎伙伴回家", "取消"];
        // 遍历任务
        dialogArray.forEach(dialogName => {
            deviceService.combinedClickText(dialogName, 2000);
        });
    },

    /**
     * 运动操作
     */
    sportOption: function () {
        this.launchSubApp("运动");
        // AD
        deviceService.combinedClickText("知道了", 1000);
        // 收运动币
        deviceService.combinedClickText("步数", 1000);
        // 走路线
        if (text("马上走").exists()) {
            deviceService.combinedClickText("马上走", 1000);
            text("去捐赠").waitFor();
            sleep(1000);
            deviceService.combinedClickText("重新走", 5000);
            deviceService.combinedClickText("立即开走", 2000);
            deviceService.clickImage(images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/立即打开.png"), 2000);
            deviceService.clickImage(images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/打开.png"), 2000);
            deviceService.combinedClickText("开心收下", 2000);
            // 收集宝箱
            this.collectTreasure();
            // deviceService.combinedClickText("可复活", 1000);
            // Go、下一关
            deviceService.clickRate(1 / 2, 93 / 100, 1000);
            deviceService.clickRate(1 / 2, 93 / 100, 3500);
            deviceService.combinedClickText("留下", 1000);
            this.closeSubApp();
        }
        // 去捐步
        if (text("捐步做公益").exists()) {
            deviceService.combinedClickText("捐步做公益", 1000);
            text("今日步数").waitFor();
            sleep(1000);
            deviceService.combinedClickText("立即捐步", 1000);
            deviceService.combinedClickText("知道了", 1000);
            back();
            sleep(1000);
        }
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 收集宝箱
     */
    collectTreasure: function () {
        log("------收集宝箱 start------");
        let treasureArray = [
            images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/sport-purpleTreasure.png"),
            images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/sport-purpleTreasureC.png"),
            images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/sport-yellowTreasure.png"),
            images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/sport-yellowTreasureC.png"),
            images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/aliCombo/sport/sport-greenTreasure.png")
        ];
        while (!this.finishCollect(treasureArray)) {
            for (let i = 0; i < treasureArray.length; i++) {
                deviceService.clickImage(treasureArray[i], 3000);
                this.clearSportDialog();
            }
        }
        log("------收集宝箱 end------");
    },

    /**
     * 收集宝箱是否结束
     */
    finishCollect: function (treasureArray) {
        for (let i = 0; i < treasureArray.length; i++) {
            if (deviceService.imageExist(treasureArray[i])) {
                return false;
            }
        }
        return true;
    },

    /**
     * 关闭响应弹框
     */
    clearSportDialog: function () {
        deviceService.comboTextClick(["收下运动币", "收下运动币", "收下"], 1000);
        deviceService.clickDIP("android.widget.Image", 18, 3, 1000);
        deviceService.clickDIP("android.widget.Image", 18, 4, 1000);
    },

    /**
     * 取消误点皮肤
     * @returns
     */
    clearForestDialog: function () {
        if (text("帮好友复活能量").exists()) {
            deviceService.clickDIP("android.widget.Button", 16, 7, 200);
        }
        // 取消误点皮肤
        deviceService.comboTextClick(["关闭", "知道了"], 100);
    },

    /**
     * 坐标点击收敛
     * @param desc
     */
    clickCoord: function (desc) {
        switch (desc) {
            // 蚂蚁庄园-领饲料
            case "collarFeed":
                deviceService.clickRate(400 / 1440, 2950 / 3200, 2800);
                return;
            // 蚂蚁庄园-种麦子
            case "plantWheat":
                deviceService.clickRate(465 / 1440, 2965 / 3200, 800);
                return;
            // 蚂蚁新村-关闭弹框
            case "closeVillageDialog":
                deviceService.clickRate(1317 / 1440, 777 / 3200, 800);
                return;
            // 神奇海洋-收垃圾
            case "takeGarbage":
                deviceService.clickRate(1070 / 1440, 2120 / 3200, 1000);
                return;
        }
    },

    /**
     * 打开子应用
     * @param {string} subApp
     */
    launchSubApp: function (subApp) {
        toastLog("====== 打开" + subApp + " ======");
        deviceService.combinedClickText(subApp, 8000);
    },

    /**
     * 关闭SubApp
     */
    closeSubApp: function () {
        deviceService.combinedClickDesc("关闭", 2000);
    },

    /**
     * 是否早于hour时minute分
     * @param {number} hour
     * @param {number} minute
     * @returns boolean
     */
    earlierThan: function (hour, minute) {
        let now = new Date();
        let compareTime = new Date();
        compareTime.setHours(hour);
        compareTime.setMinutes(minute);
        compareTime.setSeconds(0);
        return now < compareTime;
    },

    /**
     * 是否晚于hour时minute分
     * @param {number} hour
     * @param {number} minute
     * @returns boolean
     */
    laterThan: function (hour, minute) {
        let now = new Date();
        let compareTime = new Date();
        compareTime.setHours(hour);
        compareTime.setMinutes(minute);
        compareTime.setSeconds(0);
        return now > compareTime;
    },

}