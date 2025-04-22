// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');


module.exports = {

    /**
     * 切换账号
     */
    switchAccount: function (account) {
        deviceService.clickRate(1300 / 1440, 3100 / 3200, 3000);
        deviceService.combinedClickDesc("设置", 3000);
        deviceService.combinedClickDesc("切换账号", 3000);
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
        deviceService.clickRate(1290 / 1440, 2000 / 3200, 800);
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
        let browseTaskNameList = [
            "搜一搜你喜欢的商品",
            "看严选推荐商品",
            "逛精选好物",
            "逛精选手机",
            "逛逛热卖手机",
            "搜一搜你心仪的宝贝",
            "逛精选好货",
            "看农场平价好物",
            "浏览金币小镇得肥料",
        ];
        // 任务-搜一搜
        let browseTaskList = deviceService.initTaskNameList(browseTaskNameList);
        for (let i = 0; i < browseTaskList.length; i++) {
            if (text(browseTaskList[i]).exists() && text(browseTaskList[i]).findOne().parent().parent().findOne(text("去完成"))) {
                log(browseTaskList[i]);
                deviceService.clickNearBy(browseTaskList[i], "去完成", 2000);
                setText("山楂条");
                deviceService.combinedClickText("搜索", 3000);
                this.swipeViewTask(18000);
                back();
                sleep(1800);
                if (!text("去完成").exists()) {
                    back();
                    sleep(1800);
                }
                this.babaFarmBrowse();
            }
        }
        let browse15TaskNameList = [
            "浏览15秒得奖励",
            "浏览15秒得",
        ];
        // 任务-浏览15秒
        let browse15TaskList = deviceService.initTaskNameList(browse15TaskNameList);
        for (let i = 0; i < browse15TaskList.length; i++) {
            if (text(browse15TaskList[i]).exists() && text(browse15TaskList[i]).findOne().parent().parent().parent().findOne(text("去完成"))) {
                log(browse15TaskList[i]);
                deviceService.clickNearBy(browse15TaskList[i], "去完成", 2000);
                setText("山楂条");
                deviceService.combinedClickText("搜索", 3000);
                this.swipeViewTask(18000);
                back();
                sleep(1800);
                if (!text("去完成").exists()) {
                    back();
                    sleep(1800);
                }
                this.babaFarmBrowse();
            }
        }
    },

    /**
     * 芭芭农场的跳转任务
     */
    babaFarmJump: function () {
        sleep(3000);
        let jumpTaskNameList = [
            "逛逛支付宝芭芭农场",
            "去点淘领每日提现红包",
        ];
        // 任务-搜一搜
        let jumpTaskList = [];
        for (let i = 0; i < jumpTaskNameList.length; i++) {
            for (let j = 1; j <= 5; j++) {
                for (let k = 0; k < j; k++) {
                    jumpTaskList.push(jumpTaskNameList[i] + "(" + k + "/" + j + ")")
                }
            }
        }
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
        // 等等机器人验证
        let duration = 0;
        while (duration < keepTime) {
            gesture(3000, [device.width / 2, device.height / 4 * 3], [device.width / 2, device.height / 4], [device.width / 2, device.height / 4 * 3]);
            sleep(3000);
            duration += 3000;
        }
    }

}