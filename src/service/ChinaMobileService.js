// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {
    /**
     * 签到
     */
    signIn: function () {
        if (!deviceService.appExists("中国移动")) {
            return;
        }
        // 启动淘宝
        deviceService.launch("中国移动");
        sleep(3000);
        toastLog("中国移动江苏签到");
        // 广告
        deviceService.comboDescClick(["关闭", "关闭"], 500);
        // 签到
        deviceService.comboTextClick(["当月热销", "签到有惊喜", "签到", "签 到"], 5000);
        // 返回签到
        deviceService.launch("中国移动");
        // 立即抽奖
        deviceService.combinedClickText("立即抽奖", 1000);
        // 回“首页”
        deviceService.back(1000);
        deviceService.back(1000);
    }
}