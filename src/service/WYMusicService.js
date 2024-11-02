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
        text("我的").waitFor();
        sleep(1000);
        toastLog("网易云音乐签到");
        // 抽屉菜单
        deviceService.combinedClickDesc("抽屉菜单", 1000);
        // 签到
        deviceService.comboTextClick(["会员中心", "打卡"], 5000);
        // 回会员中心
        back();
        sleep(1000);
        back();
        sleep(1000);
    }
}