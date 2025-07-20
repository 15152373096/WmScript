// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {
    /**
     * 签到
     */
    signIn: function () {
        if (!deviceService.appExists("拼多多")) {
            return;
        }
        // 启动淘宝
        deviceService.launch("拼多多");
        text("个人中心").waitFor();
        sleep(1000);
        toastLog("拼多多签到");
        // 签到
        deviceService.back(200);
        deviceService.comboTextClick(["多多视频","领取今日现金","明日继续来领"], 3000);
        deviceService.clickRate(720, 2020, 1000);
    }
}