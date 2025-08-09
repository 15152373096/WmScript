// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {

    /**
     * 获得蚂蚁庄园进入答案
     */
    queryTodayChickenAnswer: function () {
        if (!deviceService.appExists("豆包")) {
            return [];
        }
        deviceService.launch("豆包");
        setText("蚂蚁庄园今日答案，直接给我答案就行，不要多余的字，用逗号分割");
        sleep(800);
        id("action_send").click();
        sleep(10000);
        // 返回答案
        return id("action_button_icon").findOne().parent().parent().parent().parent().parent().findOne(className("android.widget.TextView").depth(15).indexInParent(0)).text().split(",");
    }
}