// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');
let doubaoService = require('./DoubaoService.js');

// 用户配置
let userConfig = {};
// 小鸡课堂答案
let chickenLessonFilePath = "/sdcard/脚本/WmScript/resource/config/answer/chickenLesson.json";
let chickenLesson = {};

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
            deviceService.combinedClickDesc("设置", 3500);
            deviceService.combinedClickText("", 3500);
            // 登陆其他账号
            if (className("android.widget.TextView").text("登录其他账号").exists()) {
                className("android.widget.TextView").text("登录其他账号").findOne().click();
                sleep(1800);
            } else {
                deviceService.clickRate(720, 2520, 1800);
            }
            // 点击退出登陆后的兜底
            if (!className("android.widget.TextView").text("轻触头像以切换账号").exists() && className("android.widget.TextView").text("登录其他账号").exists()) {
                className("android.widget.TextView").text("登录其他账号").findOne().click();
                sleep(1800);
            }
            // 选择账号
            deviceService.combinedClickText(account, 8000);
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
        if ("off" == userConfig.signSwitch) {
            return;
        }
        toastLog("====== 支付宝签到 ======");
        // 我的 - 支付宝会员
        deviceService.comboTextClick(["我的", "支付宝会员"], 2000);
        // 关闭广告
        deviceService.combinedClickDesc("关闭", 800);
        // 领取积分- 每日签到
        deviceService.textMatchesArrayClick(["^领取\\d+积分$", "^全部领取\\w+", "每日签到"], 2000);
        // 逛一逛赚积分
        if (text("逛一逛赚积分").exists() && textMatches("^滑动浏览以下内容\\S+得5积分\\S+").exists()) {
            deviceService.textMatchesClick("逛一逛赚积分", 1000);
            deviceService.swipeViewTask(3600);
        }
        deviceService.textMatchesClick("做任务赚积分", 1000);
        // 积分任务
        this.scoreMission();
        // 领取积分
        deviceService.textMatchesClick("领取", 1000);
        // 关闭签到
        deviceService.clickDIP("android.widget.FrameLayout", 9, 0, 1000);
        deviceService.clickDIP("android.widget.FrameLayout", 9, 0, 5000);
        // 首页
        deviceService.combinedClickText("首页", 2000);
    },

    /**
     * 积分任务
     */
    scoreMission: function () {
        log("===== 积分任务 START =====");
        let browseTaskList = userConfig.signBrowseTaskList;
        for (let i = 0; i < 6; i++) {
            browseTaskList.forEach(browseTask => {
                if (!textMatches(browseTask).exists()) {
                    return;
                }
                let components = textMatches(browseTask).find();
                components.forEach(component => {
                    let componentText = component.text();
                    if ("逛一逛赚积分" == componentText || "逛一逛高德打车小程序" == componentText
                        || "逛一逛快手" == componentText || componentText.indexOf("滑动浏览以下内容") > -1) {
                        return
                    }
                    // 防止任务变动
                    if (!text(componentText).exists()) {
                        return
                    }
                    log("scoreMission.componentText is " + componentText);
                    text(componentText).findOne().click();
                    sleep(800);
                    deviceService.textMatchesClick("去完成", 2000);
                    // 浏览任务
                    let waitTime = componentText.indexOf("15") > 0 ? 18000 : 5000;
                    deviceService.swipeViewTask(waitTime);
                    deviceService.back(3000);
                    if (!text("换一换").exists()) {
                        deviceService.launch("支付宝");
                    }
                    if (!text("换一换").exists()) {
                        deviceService.back(3000);
                    }
                    if (!text("换一换").exists()) {
                        // 清除后台任务
                        deviceService.clearBackground();
                        // 启动支付宝
                        deviceService.launch("支付宝");
                        // 我的 - 支付宝会员
                        deviceService.comboTextClick(["我的", "支付宝会员", "每日签到"], 2000);
                    }
                });
            });
            deviceService.textMatchesClick("换一换", 1000);
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
        this.antForestOption(accountInfo.userName);
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

        let chickenLessonString = files.read(chickenLessonFilePath);
        chickenLesson = JSON.parse(chickenLessonString);
        log("======小鸡课堂答案 start======");
        log(chickenLesson);
        log("======小鸡课堂答案 end======");
    },

    /**
     * 蚂蚁庄园操作
     */
    antFarmOption: function () {
        // 打开蚂蚁庄园
        this.launchSubApp("蚂蚁庄园");
        sleep(5000);
        // 广告
        deviceService.combinedClickText("关闭", 1000);
        deviceService.clickDIP("android.widget.TextView", 17, 1, 1000);
        // 添加蚂蚁组件广告
        deviceService.clickRate(1335, 1535, 500);
        // 收取赠送麦子
        deviceService.comboTextClick(["去收取", "立即领取"], 800);
        // 打赏喂食
        deviceService.clickRate(520, 2460, 800);
        // 睡觉广告
        deviceService.clickRate(55, 2385, 800);
        // 收鸡蛋
        deviceService.clickRate(250, 2245, 1500);
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
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 小鸡日记
     */
    chickenDiary: function () {
        deviceService.clickRate(1298, 440, 1000)
        deviceService.clickRate(860, 660, 3800)
        // 贴贴小鸡
        deviceService.clickRate(720, 3040, 3800)
        if (text("点赞").exists()) {
            text("点赞").click();
            sleep(1000);
        }
        deviceService.back(2000);
    },

    /**
     * 蚂蚁庄园-道具使用
     */
    chickenTool: function () {
        log("------蚂蚁庄园-道具使用------");
        // 使用道具-加速卡
        this.chickenToolUse("我的道具", "加速卡", "使用道具");
        // 使用道具-加饭卡
        this.chickenToolUse("我的道具", "加饭卡", "使用道具");
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
        deviceService.clickRate(1295, 900, 2000);
        // 选择道具类型
        deviceService.combinedClickText(toolType, 2800);
        // 使用道具
        if (text(toolName).exists() && text(useName).exists() && text(toolName).findOne().parent().parent().findOne(text(useName))) {
            text(toolName).findOne().parent().parent().findOne(text(useName)).click();
            sleep(2800);
        }
        // 立即加速
        for (let i = 20; i > 0; i--) {
            deviceService.comboTextClick(["还有" + i + "张 立即加速", "还有" + i + "张 立即使用"], 2800);
        }
        // 使用-未使用道具场景、确认-已使用道具场景、知道了、已使用加速卡时，补充关闭
        deviceService.comboTextClick(["使用", "确认", "知道了", "知道啦", "关闭", "关闭道具弹窗"], 2800);
    },

    /**
     * 蚂蚁庄园-饲料任务
     */
    chickenTask: function () {
        log("------蚂蚁庄园-饲料任务------");
        // 领饲料
        deviceService.clickRate(400, 2950, 2800);
        // 庄园小课堂
        this.chickenQuestion();
        // 雇佣小鸡
        this.chickenHire();
        // 抽抽乐
        this.happyLottery();
        // 小鸡厨房
        this.cookDishes();
        // APP跳转任务
        this.chickenAppJump();
        // 浏览任务
        this.chickenBrowse();
        // 鲸探任务
        this.whaleExplorerTask();
        // 小鸡睡觉
        this.chickenSleep();
        log("------蚂蚁庄园-收取饲料------");
        // 领取饲料
        this.takeFodder();
        // 关闭"领饲料"的弹框
        deviceService.combinedClickText("关闭饲料任务弹窗", 1800);
    },

    /**
     * 领取饲料
     */
    takeFodder: function () {
        // 领取饲料
        let fodderList = [
            "领取540克饲料",
            "领取360克饲料",
            "领取270克饲料",
            "领取180克饲料",
            "领取180克饲料",
            "领取180克饲料",
            "领取120克饲料",
            "领取90克饲料",
            "领取90克饲料",
            "领取90克饲料",
            "领取60克饲料",
            "领取30克饲料"
        ];
        for (let fodder of fodderList) {
            deviceService.combinedClickText(fodder, 1800);
            //  满了就跳出
            if (this.checkFodderFull()) {
                break;
            }
        }
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
    chickenBrowse: function () {
        // 所有浏览任务
        let browseTaskList = userConfig.chickenBrowseTaskList;
        for (let i = 1; i <= 12; i++) {
            browseTaskList.push(i + "月数字公仔上新啦 和小鸡一起，去生活号看数字公仔攻略，可获得90g饲料哦 去完成");
        }
        // 遍历任务
        browseTaskList.forEach(browseTask => {
            if (!text(browseTask).exists()) {
                return;
            }
            // 需要做任务
            log("------饲料任务-" + browseTask + "------");
            deviceService.combinedClickText(browseTask, 5000);
            if (browseTask.indexOf("15s") >= 0) {
                // 等等机器人验证
                deviceService.swipeViewTask(18000);
            }
            deviceService.back(1800);
            if (!text("蚂蚁庄园").exists()) {
                deviceService.back(800);
            }
        });
    },

    /**
     * 鲸探任务
     */
    whaleExplorerTask: function () {
        if ("on" != userConfig.chickenTask.whaleExplorerSwitch) {
            return;
        }
        let whaleExplorerTextList = [
            "去鲸探喂鱼集福气 和小鸡一起去鲸探用饲料换鱼食，完成1次喂鱼，可获得90g饲料 去喂鱼"
        ];
        whaleExplorerTextList.forEach(whaleExplorerText => {
            if (!text(whaleExplorerText).exists()) {
                return;
            }
            // 需要做任务
            log("------饲料任务-去鲸探喂鱼集福气------");
            deviceService.combinedClickText(whaleExplorerText, 1000);
            if (text("支付宝账号快速登录").exists()) {
                // 授权登陆
                deviceService.clickDIP("android.widget.TextView", 15, 0, 800);
                deviceService.combinedClickText("支付宝账号快速登录", 1000);
            }
            text("放生池").waitFor();
            sleep(2000);
            // 喂鱼
            for (let i = 0; i < 8; i++) {
                deviceService.clickRate(1250, 2300, 2000);
                deviceService.comboTextClick(["喂鱼", "继续喂鱼"], 2000);
            }
            // 放生池点击
            for (let i = 0; i < 168; i++) {
                deviceService.clickRate(720, 1600, 200);
            }
            // 敲木鱼
            deviceService.combinedClickText("敲一敲", 1000);
            for (let i = 0; i < 168; i++) {
                deviceService.clickRate(720, 1600, 200);
            }
            // 盘珠子
            deviceService.combinedClickText("盘一盘", 1000);
            for (let i = 0; i < 168; i++) {
                swipe(device.width / 2, device.height / 2, device.width / 2, device.height, 200);
            }
            // 鱼食任务
            deviceService.comboTextClick(["放生池", "鱼食任务"], 1000);
            // 祈福任务
            if (text("为您的好友完成一次祈福吧").exists() && text("为您的好友完成一次祈福吧").findOne().parent().findOne(text("前往"))) {
                let locate = text("为您的好友完成一次祈福吧").findOne();
                let button = depth(locate.depth()).indexInParent(locate.indexInParent() + 2).findOne();
                if ("前往" == button.text()) {
                    button.click();
                    sleep(3000);
                    text("为Ta祈福").findOne().click()
                    for (let i = 0; i < 16; i++) {
                        deviceService.clickRate(720, 1600, 800);
                        if (text("确定").exists()) {
                            text("确定").click();
                            sleep(1800);
                            break;
                        }
                    }
                    deviceService.back(1000);
                    deviceService.clickRate(720, 800, 1000);
                }
            }
            // 领取
            for (let i = 7; i > 0; i--) {
                deviceService.combinedClickText("领取", 8000);
            }
            // 关闭任务
            deviceService.clickRate(1250, 1450, 2000);
            // 放生
            deviceService.clickRate(720, 2200, 1000);
            // 确定放生
            deviceService.clickRate(720, 2200, 1000);
            deviceService.back(2000);
        });
    },

    /**
     * APP跳转任务
     */
    chickenAppJump: function () {
        // 所有APP跳转任务
        let appJumpTaskList = userConfig.chickenAppJumpList;
        appJumpTaskList.forEach(appJumpTask => {
            if (!text(appJumpTask).exists()) {
                return;
            }
            log("------饲料任务-" + appJumpTask + "------");
            deviceService.combinedClickText(appJumpTask, 20000);
            deviceService.comboTextClick(["立即领取", "点击签到", "立即签到"], 1000);
            deviceService.launch("支付宝");
            if (!text("去完成").exists()) {
                deviceService.back(800);
                ;
            }
        });
    },

    /**
     * 庄园小课堂
     */
    chickenQuestion: function () {
        let answerQuestText = "庄园小课堂 每天和小鸡一起答题，可获得1次小鸡饲料哦 去答题";
        if (text(answerQuestText).exists()) {
            deviceService.combinedClickText(answerQuestText, 2000);
            text("题目来源 - 答答星球").waitFor();
            let queryDate = deviceService.formatDate(new Date());
            let resultList = chickenLesson[queryDate.formatDay];
            let questionText = this.intQuestionText();
            // 没有答案，去找答案
            if (resultList == undefined) {
                resultList = this.getChickenQuestionAnswer(resultList, queryDate, questionText);
                log("豆包返回答案: resultList = " + resultList);
            }
            // 匹配答案
            let getAnswerFlag = false;
            for (let i = 0; i < resultList.length; i++) {
                if (text(resultList[i]).exists()) {
                    text(resultList[i]).click();
                    sleep(1000);
                    getAnswerFlag = true;
                }
            }
            // 之前找的答案没有匹配，重新获取
            if (!getAnswerFlag) {
                this.getChickenQuestionAnswer(resultList, queryDate, questionText);
            }
            deviceService.back(1000);
        }
    },

    /**
     * 获取答案
     */
    getChickenQuestionAnswer: function (resultList, queryDate, questionText) {
        if (resultList == undefined) {
            resultList = [];
        }
        let result = doubaoService.queryTodayChickenAnswer(questionText);
        resultList.push(result)
        // 保存
        chickenLesson[queryDate.formatDay] = resultList
        files.write(chickenLessonFilePath, JSON.stringify(chickenLesson));
        sleep(800);
        // 回到支付宝
        deviceService.launch("支付宝");
        return resultList;
    },

    /**
     * 拼装提问文本
     * @returns questionText
     */
    intQuestionText: function () {
        let array = className("android.widget.TextView").depth(17).indexInParent(0).find();
        let question;
        array.forEach(item => {
            if (item.text() && item.text().trim() !== "") {
                question = item.text();
            }
        });
        let answerArray = className("android.widget.TextView").depth(18).find().map(item => item.text());
        return '问题：' + question + '； 答案选项：' + answerArray + '；请给出答案，直接原文返回答案选项中的正确结果，不要任何多余的字';
    },

    /**
     * 雇佣小鸡
     */
    chickenHire: function () {
        let hireTextList = [
            "雇佣小鸡拿饲料 在任务指定页面中雇佣小鸡可获得90g饲料，雇佣特定小鸡可获得180g饲料哦（1次/天） 去完成"
        ];
        hireTextList.forEach(hireText => {
            if (!text(hireText).exists()) {
                return;
            }
            deviceService.combinedClickText(hireText, 2000);
            deviceService.comboTextClick(["雇佣", "雇佣并通知", "不通知TA"], 1000);
            this.closeSubApp();
        });
    },

    /**
     * 抽抽乐
     */
    happyLottery: function () {
        // 所有抽抽乐任务
        let happyLotteryList = userConfig.chickenHappyLottery;
        // 遍历任务
        happyLotteryList.forEach(happyLottery => {
            if (text(happyLottery).exists()) {
                // 抽抽乐
                deviceService.combinedClickText(happyLottery, 2000);
                // 任务
                this.lotteryTask();
                // 抽奖
                for (let i = 24; i > 0; i--) {
                    deviceService.combinedClickText("还剩" + i + "次机会", 6000);
                    deviceService.comboTextClick([
                        "继续抽奖",
                        "继续抽",
                        "继续抽还剩8次机会",
                        "继续抽还剩7次机会",
                        "继续抽还剩6次机会",
                        "继续抽还剩5次机会",
                        "继续抽还剩4次机会",
                        "继续抽还剩3次机会",
                        "继续抽还剩2次机会",
                        "继续抽还剩1次机会",
                        "开心收下",
                        "知道啦"
                    ], 1000);
                }
                // 回退到任务
                deviceService.back(1000);
            }
        });
    },

    /**
     * 抽抽乐任务
     */
    lotteryTask: function () {
        // 每日签到 
        deviceService.comboTextClick(["领取", "领取"], 3000);
        // 兑换饲料
        for (let i = 0; i < 2; i++) {
            if (text("消耗饲料换机会 (" + i + "/2)").exists()) {
                deviceService.clickNearBy("消耗饲料换机会 (" + i + "/2)", "去完成", 3000);
                deviceService.combinedClickText("确认兑换", 5000)
            }
            if (text("消耗饲料换机会(" + i + "/2)").exists()) {
                deviceService.clickNearBy("消耗饲料换机会(" + i + "/2)", "去完成", 3000);
                deviceService.combinedClickText("确认兑换", 5000)
            }
        }
        // 逛一逛
        for (let i = 0; i < 3; i++) {
            if (text("去杂货铺逛一逛 (" + i + "/3)").exists()) {
                deviceService.clickNearBy("去杂货铺逛一逛 (" + i + "/3)", "去完成", 5000);
                deviceService.swipeViewTask(18000);
                deviceService.back(1000);
                deviceService.clickNearBy("去杂货铺逛一逛 (" + (i + 1) + "/3)", "领取", 5000);
            }
            if (text("去杂货铺逛一逛(" + i + "/3)").exists()) {
                deviceService.clickNearBy("去杂货铺逛一逛(" + i + "/3)", "去完成", 5000);
                deviceService.swipeViewTask(18000);
                deviceService.back(1000);
                deviceService.clickNearBy("去杂货铺逛一逛(" + (i + 1) + "/3)", "领取", 5000);
            }
        }
    },

    /**
     * 小鸡睡觉
     */
    chickenSleep: function () {
        let sleepTaskList = [
            "让小鸡去睡觉 每晚20点-次日6点，去爱心小屋让小鸡睡觉，可以产爱心蛋和肥料，还可获得90g饲料哦 去完成"
        ];
        sleepTaskList.forEach(sleepTask => {
            if (deviceService.earlierThan(20, 0) || !text(sleepTask).exists()) {
                return;
            }
            log("------饲料任务-小鸡睡觉------");
            deviceService.combinedClickText(sleepTask, 5000);
            // 点击睡觉
            deviceService.clickRate(720, 1066, 800);
            // 去睡觉
            deviceService.combinedClickText("去睡觉", 800);
            deviceService.combinedClickText(userConfig.chickenTask.sleepPlace, 800);
            // 后退到“任务”
            if (text("饲料不足，去做任务").exists()) {
                deviceService.combinedClickText("关闭", 800);
            }
            // 通知提醒
            deviceService.combinedClickText("取消", 800);
            deviceService.back(800);
        });
    },

    /**
     * 做菜
     */
    cookDishes: function () {

        let cookTaskList = [
            "小鸡厨房 去爱心小屋厨房让小鸡做美食得肥料，吃美食可以加速产蛋，还可以获得90g饲料哦 去完成"
        ];
        cookTaskList.forEach(cookTask => {
            if (!text(cookTask).exists()) {
                return;
            }
            log("------饲料任务-小鸡厨房------");
            deviceService.combinedClickText(cookTask, 3500);
            for (let i = 0; i < 2; i++) {
                // 没有开通芭芭农场，不收集农场食材
                if ("off" == userConfig.babaFarmSwitch) {
                    break;
                }
                // 施肥食材
                deviceService.clickRate(420, 720, 5000);
                if (text("任务列表").exists()) {
                    // 施肥
                    deviceService.clickRate(720, 2585, 1000);
                    // 返回
                    deviceService.back(1000)
                }
            }
            // 厨房垃圾
            deviceService.clickRate(1245, 1280, 2800);
            // 关闭弹窗
            deviceService.combinedClickText("关闭", 800);
            // 领取食材
            deviceService.clickRate(1270, 2230, 2800);
            // 我知道了、关闭弹窗
            deviceService.comboTextClick(["我知道了", "关闭", "取消"], 800);
            // 爱心食材店
            deviceService.clickRate(206, 1120, 1800)
            // 领10g食材
            deviceService.combinedClickText("领10g食材", 800);
            // 后退
            deviceService.back(1000);
            // 如果触发连续后退
            if (text("小鸡厨房").exists()) {
                deviceService.clickNearBy("小鸡厨房", "去完成", 3500);
            }
            sleep(800);
            for (let i = 0; i < 3; i++) {
                // 做美食
                deviceService.clickRate(1030, 3010, 6000);
                // 关闭弹窗
                deviceService.combinedClickText("关闭", 800);
            }
            // 退到任务
            deviceService.back(1000);
        });

    },

    /**
     * 捐蛋
     */
    donateEgg: function () {
        if (deviceService.laterThan(7, 0)) {
            return;
        }
        // 点击去捐蛋
        deviceService.clickRate(885, 2975, 5000);
        // 捐蛋
        deviceService.clickRate(1030, 3010, 6000);
        text("立即捐蛋").waitFor();
        deviceService.comboTextClick(["立即捐蛋", "立即捐蛋"], 8000);
        sleep(10000);
        deviceService.back(1000);
        if (!text("去捐蛋").exists()) {
            // 回到庄园
            deviceService.back(1000);
        }
        deviceService.combinedClickText("关闭", 800);
    },

    /**
     * 喂食小鸡
     */
    feedChicken: function () {
        // 喂食饲料
        deviceService.clickRate(1115, 2970, 800);
        // 小鸡不在家，领回小鸡
        this.takeBackChicken();
        // 关闭饲料不足弹窗
        deviceService.combinedClickText("取消", 1800);
        // 喂食美食
        // deviceService.clickRate(1335, 2970, 800);
    },

    /**
     * 领回小鸡
     */
    takeBackChicken: function () {
        if (className("android.widget.Button").text("找小鸡").exists()) {
            className("android.widget.Button").text("找小鸡").findOne().click();
            sleep(8000);
            // 找小鸡场景
            deviceService.clickRate(550, 2188, 800);
            // 下次再说
            deviceService.combinedClickText("下次再说", 800);
            // 确认带小鸡回家
            deviceService.combinedClickText("确认", 5000);
            // 点击右边
            deviceService.clickRate(980, 2188, 800);
            // 下次再说
            deviceService.combinedClickText("下次再说", 800);
            // 确认带小鸡回家
            deviceService.combinedClickText("确认", 5000);
            // 找回后，喂食饲料
            deviceService.clickRate(1115, 2970, 800);
        }
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
        deviceService.clickRate(1265, 2325, 800);
        // 通知申请、关闭明日可领取、通知申请
        deviceService.comboTextClick(["取消", "关闭", "取消"], 2000);
        // 施肥
        deviceService.clickRate(720, 2585, 1000);
        // 好的
        deviceService.comboTextClick(["好的", "关闭", "取消"], 800);
        // 立即领奖
        deviceService.comboTextClick(["立即领奖", "立即领肥", "立即领肥", "立即领取"], 2000);
        ["点此逛一逛再得1000肥料>", "点此逛一逛再赚1000肥料>"].forEach(task => {
            if (text(task).exists()) {
                deviceService.combinedClickText(task, 2000);
                deviceService.swipeViewTask(18000);
                deviceService.back(800);
            }
        });
        deviceService.comboTextClick(["领取", "领取", "关闭", "取消"], 2000);
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
        deviceService.combinedClickText("关闭", 1000);
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 芭芭农场的浏览任务
     */
    babaFarmBrowse: function () {
        // 所有浏览任务
        let browseTaskList = userConfig.babaBrowseTaskList;
        log("芭芭农场的浏览任务 start");
        // 遍历任务
        browseTaskList.forEach(browseTask => {
            if (text(browseTask).exists()) {
                // 点击任务
                text(browseTask).click();
                sleep(5000);
                if (text("搜索后浏览立得奖励").exists()) {
                    setText("山楂条");
                    deviceService.combinedClickText("搜索", 3000);
                }
                deviceService.swipeViewTask(18000);
                deviceService.back(800);
                if (text("搜索后浏览立得奖励").exists()) {
                    deviceService.back(800);
                }
            }
        });
        log("芭芭农场的浏览任务 end");
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
        deviceService.clickRate(740, 1660, 2000);
        // 通知申请
        deviceService.combinedClickText("取消", 2000);
        if ("on" == userConfig.antNewVillageTask.takeAwayVendors) {
            // 请走TA
            click(720, 2595);
            sleep(1800);
            deviceService.comboTextClick(["请走TA", "请走TA"], 1000);
            // 关闭弹框
            this.clickCoordinates("closeVillageDialog");
            // 请走TA
            click(270, 2310);
            sleep(1800);
            deviceService.comboTextClick(["请走TA", "请走TA"], 1000);
            // 关闭弹框
            this.clickCoordinates("closeVillageDialog");
        }
        // 摆摊
        deviceService.clickRate(1195, 2967, 1800);
        // 全部收摊、确认收摊、随机摆摊、我知道了
        deviceService.comboTextClick(["全部收摊", "确认收摊", "随机摆摊", "返回新村"], 1800);
        // 关闭弹框
        this.clickCoordinates("closeVillageDialog");
        // 加速产币
        deviceService.clickRate(720, 2960, 1000);
        // 可以领取农民就领取
        deviceService.combinedClickText("领取", 800);
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 蚂蚁森林操作
     */
    antForestOption: function (userName) {
        // 打开蚂蚁新村
        this.launchSubApp("蚂蚁森林");
        // 关闭弹框
        this.clearForestDialog();
        // 开启新图鉴/抽取物种卡
        deviceService.clickRate(955, 1900, 3000);
        deviceService.combinedClickText("再抽一次(1)", 3000);
        deviceService.back(1000);
        if (!text(userName).exists()) {
            deviceService.back(1000);
        }
        // 收取赠送能量
        for (let i = 0; i < 15; i++) {
            deviceService.clickRate(360, 680, 500);
        }
        if ("on" == userConfig.antForestTask.takeEnergySwitch) {
            // 主账号收能量
            this.takeEnergy();
        } else {
            // 小号接受复活能量
            deviceService.clickRate(360, 680, 500);
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
        deviceService.comboTextClick(["收我最多榜", "查看更多好友", friendName], 2000);
        sleep(3800);
        for (let i = 0; i < 3; i++) {
            // 点击浇水
            deviceService.clickRate(1315, 2474, 1000);
            // 选择66g
            deviceService.combinedClickText("66克", 600);
            // 浇水
            deviceService.combinedClickText("浇水送祝福", 4500);
        }
        // 种植礼包
        deviceService.clickRate(360, 680, 2000);
        deviceService.combinedClickText("知道了", 2000);
        // 回退到排行榜
        deviceService.back(800);
        // 回退到蚂蚁森林
        deviceService.back(800);
    },

    /**
     * 收/偷能量
     */
    takeEnergy: function () {
        // 关闭弹框
        deviceService.comboTextClick(["关闭", "取消", "我知道了"], 1000);
        toastLog("====== 开始找能量 ======");
        // 收自己
        let cordArray = [
            [320, 1665],
            [260, 964],
            [1180, 964],
            [444, 864],
            [996, 864],
            [628, 764],
            [812, 764],
        ];
        cordArray.forEach(cord => {
            deviceService.clickRate(cord[0], cord[1], 200);
            this.clearForestDialog();
        });
        do {
            // 偷别人-找能量
            deviceService.clickRate(1315, 2115, 3000);
            // 收能量
            this.energyClick();
            // 如果找完了，返回森林
            if (deviceService.anyTextExists(["返回森林首页", "去看看", "领取"])) {
                deviceService.combinedClickText("领取", 800);
                break;
            }
        } while (textEndsWith("的蚂蚁森林").exists());
        toastLog("====== 结束找能量 ======");
    },

    /**
     * 收能量的点击操作
     */
    energyClick: function () {
        // 别人的用一键收
        deviceService.clickRate(720, 1810, 800);
        deviceService.clickRate(720, 1810, 800);
        // 种植礼包
        deviceService.clickRate(360, 680, 2000);
        // 复活能量
        deviceService.clickRate(720, 2060, 2800);
        this.clearForestDialog();
        // 打印日志
        if (className("android.widget.TextView").depth(12).indexInParent(0).exists()) {
            let forestInfo = className("android.widget.TextView").depth(12).indexInParent(0).findOne().text();
            log("收取他人能量:" + forestInfo);
        }
    },

    /**
     * 神奇海洋操作
     */
    magicSeaOption: function () {
        this.launchSubApp("神奇海洋");
        // 知道了
        deviceService.combinedClickText("知道了", 2000);
        // 收垃圾
        this.clickCoordinates("takeGarbage");
        // 清理弹框
        this.clearSeaDialog();
        // 回到我的海洋
        if (text("回到我的海洋").exists()) {
            text("回到我的海洋").click();
        }
        while (true) {
            // 找拼图
            deviceService.clickRate(1325, 2500, 5000);
            if (text("回到我的海洋").exists()) {
                text("回到我的海洋").click();
                sleep(800);
                break;
            }
            // 收垃圾
            this.clickCoordinates("takeGarbage");
            // 清理弹框
            this.clearSeaDialog();
        }
        // 奖励
        deviceService.clickRate(1220, 3000, 2000);
        // 去答题
        while (text("去答题").exists()) {
            // 去答题
            deviceService.combinedClickText("去答题", 5000);
            // 选答案
            deviceService.clickDIP("android.widget.TextView", 18, 0, 500);
            deviceService.back(1000);
        }
        // 去看看
        if (text("去看看").exists() && "on" == userConfig.magicSeaTask.jumpAppSwitch) {
            let buttons = text("去看看").find();
            buttons.forEach(button => {
                // 去看看
                button.click();
                sleep(5000);
                // 跳过的任务
                if (text("每通过1关可获得100心情值").exists()) {
                    deviceService.back(1000);
                    return;
                }
                // 立即领取 / 如果是随机游戏任务，进入游戏中心要点击一个任务
                deviceService.comboTextClick(["立即领取", "角色扮演"], 5000);
                deviceService.swipeViewTask(30000)
                this.closeSubApp();
                deviceService.back(1000);
            });
        }
        // 去逛逛
        if (text("去逛逛").exists() && "on" == userConfig.magicSeaTask.jumpAppSwitch) {
            let buttons = text("去逛逛").find();
            buttons.forEach(button => {
                // 去逛逛
                button.click();
                sleep(5000);
                // 跳过的任务
                if (text("天天领现金").exists()) {
                    deviceService.combinedClickDesc("关闭", 800)
                    return;
                }
                deviceService.comboTextClick(["点击签到", "立即签到", "立即领取"], 1000);
                deviceService.swipeViewTask(18000)
                deviceService.launch("支付宝");
                if (!text("立即领取").exists()) {
                    deviceService.back(1000);
                }
            });
        }
        sleep(1000);
        while (text("立即领取").exists()) {
            // 立即领取
            deviceService.comboTextClick(["立即领取", "收下", "迎回海洋伙伴", "返回"], 2000);
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
        if (deviceService.earlierThan(21, 0)) {
            return;
        }
        this.launchSubApp("运动");
        deviceService.textMatchesArrayClick(["知道了", "暂不允许", "暂不开启", "步数", "步数奖励"], 2000);
        // 下午5点25前，不走路线
        if (deviceService.laterThan(22, 25)) {
            if (text("马上走").exists()) {
                deviceService.combinedClickText("马上走", 8000);
            } else {
                deviceService.clickRate(230, 2150, 8000);
            }
            // 开心收下
            deviceService.comboTextClick(["立即开走", "开心收下", "打开", "可找回", "取消"], 2000);
            if (text("当前路线已走完").exists()) {
                deviceService.clickDIP("android.widget.Image", 15, 5, 800);
                deviceService.clickDIP("android.widget.Image", 15, 6, 800);
            }
            // Go、下一关
            deviceService.clickRate(720, 2976, 1000);
            deviceService.clickRate(720, 2976, 3500);
            // 立即打开
            deviceService.comboTextClick(["打开", "立即打开"], 2000);
            this.closeSubApp();
        }
        // 去捐步
        if (text("捐步做公益").exists()) {
            text("捐步做公益").click();
            sleep(6000);
            deviceService.combinedClickText("立即捐步", 1000);
            deviceService.combinedClickText("知道了", 1000);
            deviceService.back(1000);
        }
        // 回到首页
        this.closeSubApp();
    },

    /**
     * 取消弹框
     */
    clearForestDialog: function () {
        if (text("帮好友复活能量").exists()) {
            deviceService.clickRate(720, 2060, 2800);
        }
        if (text("添加「蚂蚁森林」到桌面").exists()) {
            className("android.widget.Image").depth(11).indexInParent(0).findOne().click();
        }
        // 取消误点皮肤
        deviceService.comboTextClick(["关闭", "关闭按钮", "知道了", "关闭弹窗"], 1000);
    },

    /**
     * 坐标点击收敛
     * @param desc
     */
    clickCoordinates: function (desc) {
        switch (desc) {
            // 蚂蚁新村-关闭弹框
            case "closeVillageDialog":
                deviceService.clickRate(1317, 777, 800);
                return;
            // 神奇海洋-收垃圾
            case "takeGarbage":
                deviceService.clickRate(1070, 2120, 1000);
                return;
        }
    },

    /**
     * 打开子应用
     * @param {string} subApp
     */
    launchSubApp: function (subApp) {
        toastLog("====== 打开" + subApp + " ======");
        id("com.alipay.android.phone.openplatform:id/home_app_view").find().forEach(appView => {
            let target = appView.children().findOne(text(subApp));
            if (target) {
                appView.click()
            }
        });
        sleep(8000);
    },

    /**
     * 临时闪购广告
     */
    closeShanGouAD: function () {
        deviceService.combinedClickDesc("关闭", 2000);
        // 不识别模块时，坐标点击后回退
        deviceService.clickRate(720, 2358, 2000);
        if (!text("扫一扫").exists()) {
            deviceService.back(1000);
        }
    },

    /**
     * 关闭SubApp
     */
    closeSubApp: function () {
        deviceService.combinedClickDesc("关闭", 2000);
    }
}