// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {

    /**
     * 赚取时间
     */
    earnTime: function () {
        // 允许截图
        deviceService.allowScreenCapture();
        // 关闭广告
        deviceService.combinedClickText("关闭", 1000);
        while (text("立即领时长").exists() || text("免费领时长").exists() || text("提前领时长").exists()) {
            deviceService.combinedClickText("立即领时长", 1000);
            deviceService.combinedClickText("免费领时长", 1000);
            deviceService.combinedClickText("提前领时长", 1000);
            deviceService.clickRate(1 / 2, 58 / 100, 5000);
            deviceService.clickImage(images.read("/sdcard/脚本/WmScript/resource/image/" + device.model + "/ximalaya/看视频领30分钟时长.png"), 5000);
            if (text("点击后领取30分钟时长").exists()) {
                deviceService.combinedClickText("点击后领取30分钟时长", 1000);
                app.launchApp("喜马拉雅");
                sleep(2000);
            }
            while (true) {
                if (text("已获得免费收听时长").exists()) {
                    log("已获得免费收听时长");
                    sleep(800);
                    if (className("android.widget.ImageView").depth(11).indexInParent(1).exists()) {
                        deviceService.clickDIP("android.widget.ImageView", 11, 1, 3000);
                    } else if (className("android.widget.ImageView").depth(6).indexInParent(1).exists()) {
                        deviceService.clickDIP("android.widget.ImageView", 6, 1, 3000);
                    } else {
                        deviceService.clickRate(1310 / 1440, 290 / 3200, 3000);
                    }
                    break;
                }
            }
            // 关闭
            id("main_close").click();
            sleep(2000);
        }
    }
}

