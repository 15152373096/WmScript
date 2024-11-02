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
        back();
        sleep(200);
        deviceService.combinedClickText("多多视频", 1000);
        deviceService.clickRate(720 / 1440, 2020 / 3200, 1000);
    }
}