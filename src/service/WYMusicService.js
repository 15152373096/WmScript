// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {
    /**
     * 签到
     */
    signIn: function () {
        if (!deviceService.appExists("网易云音乐")) {
            return;
        }
        // 启动淘宝
        deviceService.launch("网易云音乐");
        sleep(3000);
        toastLog("网易云音乐签到");
        // 抽屉菜单
        deviceService.combinedClickDesc("抽屉菜单", 1000);
        // 会员中心
        deviceService.combinedClickText("会员中心", 5000);
        // 弹框广告
        if (className("android.widget.Button").depth(15).indexInParent(1).exists()) {
            className("android.widget.Button").depth(15).indexInParent(1).click();
        }
        //
        deviceService.comboTextClick(["一键领取+15", "打卡", "领取+3"], 5000);
        // 回会员中心
        back();
        sleep(1000);
        back();
        sleep(1000);
    }
}