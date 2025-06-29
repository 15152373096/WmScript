// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {
    /**
     * 签到
     */
    signIn: function () {
        if (!deviceService.appExists("阿里云盘")) {
            return;
        }
        toastLog("阿里云盘签到");
        deviceService.launch("阿里云盘");
        text("我的").waitFor();
        sleep(1000);
        // 签到
        deviceService.combinedClickText("领取", 1000);
        back();
        sleep(1000);
    }
}