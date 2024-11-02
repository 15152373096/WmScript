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
        text("品牌福利").waitFor();
        sleep(1000);
        toastLog("中国移动江苏签到");
        // 广告
        deviceService.combinedClickDesc("关闭", 500);
        deviceService.combinedClickDesc("关闭", 500);
        // 签到
        deviceService.comboTextClick(["品牌福利", "签到", "签 到", "返回签到", "立即抽奖"], 8000);
        // 回“首页”
        back();
        sleep(1000);
        back();
        sleep(1000);
    }
}