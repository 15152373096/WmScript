// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');


module.exports = {

    /**
     * 切换账号
     */
    switchAccount: function (account) {
        // 我的淘宝
        deviceService.clickRate(1300, 3100, 3000);
        deviceService.comboDescClick(["设置", "切换账号"], 3000);
        if (text("当前登录").exists()) {
            let currentAccount = text("当前登录").findOne().parent().findOne(className("android.widget.TextView").depth(18)).text()
            // 当前的账号就是要切换的
            if (currentAccount == account) {
                // 退回到设置
                deviceService.back(1000);
                // 我的淘宝
                deviceService.back(1000);
                // 首页
                deviceService.clickRate(144, 3100, 3000);
                return;
            }
        }
        // 切工号场景
        deviceService.combinedClickText(account, 5000);
        deviceService.combinedClickDesc("关闭按钮", 3000);
    },

    /**
     * 芭芭农场操作
     */
    babaFarmTask: function (account) {
        desc("芭芭农场").click();
        sleep(1000);
        text("集肥料").waitFor();
        sleep(8000);
        deviceService.textMatchesArrayClick(["立即领取", "立即领取", "立即领取", "立即领取", "领取奖励", "参与比赛"], 2000)
        // 点击领取
        deviceService.clickRate(1290, 2000, 800);
        // 集肥料
        deviceService.textMatchesArrayClick(["提醒我明天领", "取消订阅每日肥料提醒", "继续施肥", "集肥料", "集肥料", "去签到"], 2000);
        // 答题任务
        this.answerQuestion();
        // 芭芭农场的浏览任务
        this.babaFarmBrowse();
        if (account == "家人留名") {
            // 芭芭农场的跳转任务
            this.babaFarmJump();
        }
        deviceService.textMatchesArrayClick(["立即领取", "立即领取"], 5000);
        deviceService.combinedClickDesc("返回首页", 1000);
        // 夸克芭芭农场任务
        this.quarkBaBaFarmTask();
    },

    /**
     * 夸克芭芭农场任务
     */
    quarkBaBaFarmTask: function () {
        // 启动夸克
        deviceService.launch("夸克");
        // 同步淘宝账号
        this.syncAccount();
        // 赚取肥料
        // this.quarkEarnFertilizer()
    },

    /**
     * 夸克赚取肥料
     */
    quarkEarnFertilizer: function () {
        // 点击领取
        deviceService.clickRate(1290, 1860, 2000);
        // 提醒我领取,取消订阅每日肥料提醒
        if (text("提醒我领取").exists() || text("取消订阅每日肥料提醒").exists()) {
            deviceService.back(800);
        }
        // 更多肥料
        deviceService.clickRate(1265, 2500, 2000);
        // 可领取
        deviceService.comboTextClick(["可领取", "我知道啦", "取消订阅每日肥料提醒"], 3000);
        // 浏览广告任务
        let taskArray = [
            "浏览广告得肥料",
            "看视频得肥料"
        ];
        taskArray.forEach(task => {
            let count = 0;
            while (text(task).exists() && text(task).findOne().parent().findOne(text("去完成")) && count < 15) {
                count++;
                text(task).findOne().parent().findOne(text("去完成")).click();
                sleep(6000);
                // 跳转场景
                deviceService.combinedClickText("立即获取", 1000);
                // 浏览任务
                deviceService.swipeViewTask(30000);
                // 做完任务回去
                deviceService.launch("夸克");
                if (id("noah_hc_close_icon").exists()) {
                    id("noah_hc_close_icon").click();
                    sleep(2000);
                }
                if (text("奖励已发放").exists()) {
                    id("noah_hc_close_button").click();
                    sleep(2000);
                    // 更多肥料
                    deviceService.clickDIP("android.widget.TextView", 19, 3, 2000);
                }
                if (text("进入微信小游戏自由畅玩").exists()) {
                    // 关闭任务
                    deviceService.clickDIP("android.widget.FrameLayout", 8, 3, 2000);
                    // 更多肥料
                    deviceService.clickDIP("android.widget.TextView", 19, 3, 2000);
                }
                if (text("反馈").exists() || text("恭喜获得奖励").exists()) {
                    // 关闭任务
                    deviceService.clickDIP("android.widget.LinearLayout", 11, 0, 2000);
                    deviceService.clickDIP("android.widget.ImageView", 11, 0, 2000);
                    // 更多肥料
                    deviceService.clickDIP("android.widget.TextView", 19, 3, 2000);
                }
                if (text("打开App体验15秒，即可获得奖励").exists()) {
                    // 关闭任务
                    deviceService.clickDIP("android.widget.ImageView", 10, 0, 2000);
                    deviceService.combinedClickText("关闭广告", 1000);
                    // 更多肥料
                    deviceService.clickDIP("android.widget.TextView", 19, 3, 2000);
                }
                deviceService.combinedClickText("跳过", 1000);
                sleep(3000);
                deviceService.combinedClickText("我知道啦", 1000);
                // 没有回退到日常任务
                if (!text("日常任务").exists()) {
                    // 清除后台任务
                    deviceService.clearBackground();
                    // 启动夸克
                    deviceService.launch("夸克");
                    // 更多肥料
                    deviceService.clickDIP("android.widget.TextView", 19, 3, 2000);
                }

            }
        });

        // for (let i = 0; i < 10; i++) {
        //     // 看视频
        //     deviceService.clickRate(1220, 1800, 3000);
        //     sleep(8000);
        //     deviceService.comboTextClick(["继续看视频", "看视频领奖励"], 2000);
        //     sleep(20000);
        //     deviceService.comboTextClick(["放弃福利"], 2000);
        //     sleep(10000);
        //     deviceService.clickRate(1315, 200, 2000);
        //     deviceService.comboTextClick(["跳过"], 1000);
        //     back();
        //     sleep(800);
        // }

        // 回到首页
        deviceService.back(800);
        deviceService.back(800);
        // 回到淘宝
        deviceService.clearBackground();
        deviceService.launch("淘宝");
    },

    /**
     * 同步淘宝账号
     */
    syncAccount: function () {
        // 点击菜单
        deviceService.clickRate(1218, 3096, 2000);
        sleep(2000);
        // 点击头像
        deviceService.clickRate(135, 280, 2000);
        // 如果是登陆的，退出登陆
        if (text("退出登录").exists()) {
            deviceService.comboTextClick(["退出登录", "退出登录"], 1000);
        } else {
            // 取消个人隐私弹框
            deviceService.combinedClickText("不同意", 1000);
        }
        // 退回到主页
        deviceService.back(1000);
        // 点击芭芭农场
        deviceService.combinedClickText("芭芭农场", 6000);
        if (text("淘宝").exists()) {
            // 勾选协议
            className("android.widget.TextView").depth(23).indexInParent(0).clickable(true).click();
            sleep(800);
            // 选择同步淘宝账号
            deviceService.combinedClickText("淘宝", 4000);
        } else {
            // 勾选协议
            deviceService.clickRate(280, 2175, 800)
        }
        deviceService.textMatchesArrayClick(["确认授权", "确认绑定并同意协议"], 4000);
        if (text("绑定手机号").exists()) {
            deviceService.back(800);
        }
    },


    /**
     * 答题任务
     */
    answerQuestion: function () {
        // 已经答题过了
        if (!text("去答题").exists()) {
            return;
        }
        // 开始答题
        deviceService.textMatchesArrayClick(["去答题", "立即领取"], 3000);
        // 选第一答案
        deviceService.clickDIP("android.widget.Button", 17, 1, 2000);
        // 如果答对了
        if (text("领取奖励 500").exists()) {
            text("领取奖励 500").click();
            sleep(2000);
        } else {
            text("关闭").click();
            sleep(1000);
            deviceService.comboTextClick(["集肥料", "集肥料", "去答题"], 3000);
            // 选第二答案
            deviceService.clickDIP("android.widget.Button", 17, 2, 2000);
            deviceService.combinedClickText("领取奖励 500", 2000);
        }
        // 回到集肥料任务
        deviceService.comboTextClick(["集肥料", "集肥料"], 3000);
    },

    /**
     * 芭芭农场的浏览任务
     */
    babaFarmBrowse: function () {
        sleep(3000);
        for (let i = 0; i < 10; i++) {
            let components = textMatches("浏览.*得.*").find();
            components.forEach(component => {
                let componentText = component.text();
                // 防止任务变动
                if (!text(componentText).exists()) {
                    return
                }
                log("babaFarmBrowse.componentText is " + componentText);
                text(componentText).findOne().click();
                sleep(3000);
                setText("山楂条");
                deviceService.textMatchesArrayClick(["搜索", "点击签到", "立即签到"], 3000);
                // 浏览任务
                let waitTime = componentText.indexOf("15") > 0 ? 25000 : 5000;
                deviceService.swipeViewTask(waitTime);
                deviceService.back(1800);
                if (!text("去完成").exists()) {
                    deviceService.back(1800);
                }
                if (!text("去完成").exists()) {
                    // 清除后台任务
                    deviceService.clearBackground();
                    // 启动支付宝
                    deviceService.launch("淘宝");
                    desc("芭芭农场").click();
                    sleep(1000);
                    text("集肥料").waitFor();
                    sleep(8000);
                    deviceService.textMatchesArrayClick(["立即领取", "立即领取", "立即领取", "立即领取", "领取奖励", "集肥料"], 2000)
                }
            });
        }

    },

    /**
     * 芭芭农场的跳转任务
     */
    babaFarmJump: function () {
        sleep(3000);
        let jumpTaskList = [
            "逛逛支付宝芭芭农场(0/1)",
            "去点淘领每日提现红包",
        ];
        for (let i = 0; i < jumpTaskList.length; i++) {
            if (text(jumpTaskList[i]).exists() && text(jumpTaskList[i]).findOne().parent().parent().findOne(text("去完成"))) {
                deviceService.clickNearBy(jumpTaskList[i], "去完成", 15000);
                setText("山楂条");
                deviceService.combinedClickText("搜索", 3000);
                deviceService.launch("淘宝");
                if (!text("集肥料").exists()) {
                    deviceService.back(1800);
                }
                this.babaFarmJump();
            }
        }
    }
}