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
                back();
                sleep(1000);
                // 我的淘宝
                back();
                sleep(1000);
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
    babaFarmOption: function (account) {
        deviceService.combinedClickDesc("芭芭农场", 1000);
        text("集肥料").waitFor();
        sleep(8000);
        deviceService.combinedClickText("参与比赛", 1000);
        // 点击领取
        deviceService.clickRate(1290, 2000, 800);
        // 集肥料
        deviceService.comboTextClick(["提醒我明天领", "取消订阅每日肥料提醒", "集肥料", "去签到"], 1000);
        // 芭芭农场的浏览任务
        this.babaFarmBrowse();
        if (account == "家人留名") {
            // 芭芭农场的跳转任务
            this.babaFarmJump();
        }
        deviceService.comboTextClick(["立即领取", "立即领取"], 5000);
        deviceService.combinedClickDesc("返回首页", 1000);
    },

    /**
     * 芭芭农场的浏览任务
     */
    babaFarmBrowse: function () {
        sleep(3000);
        let browseTaskList = [
            "浏览15秒得奖励",
            "浏览15秒得",
        ];
        browseTaskList.forEach(browseTask => {
            while (text(browseTask).exists()) {
                text(browseTask).findOne().click();
                sleep(3000);
                setText("山楂条");
                deviceService.combinedClickText("搜索", 3000);
                deviceService.comboTextClick(["点击签到", "立即签到"], 1000);
                this.swipeViewTask(18000);
                back();
                sleep(1800);
                if (!text("去完成").exists()) {
                    back();
                    sleep(1800);
                }
            }
        });
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
                app.launchApp("淘宝");
                if (!text("集肥料").exists()) {
                    back();
                    sleep(1800);
                }
                this.babaFarmJump();
            }
        }
    },

    /**
     * 下滑浏览任务
     */
    swipeViewTask: function (keepTime) {
        let duration = 0;
        while (duration < keepTime) {
            gesture(3000, [device.width / 2, device.height / 4 * 3], [device.width / 2, device.height / 4], [device.width / 2, device.height / 4 * 3]);
            sleep(3000);
            duration += 3000;
        }
    }

}