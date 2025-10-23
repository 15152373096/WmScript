// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {

    /**
     * 获得蚂蚁庄园进入答案
     */
    queryTodayChickenAnswer: function (questionText) {
        if (!deviceService.appExists("豆包")) {
            return [];
        }
        deviceService.launch("豆包");
        // 如果是语音输入，切换成文本输入
        if (id("com.larus.nova:id/action_input").exists()) {
            id("com.larus.nova:id/action_input").click()
        }
        setText(questionText);
        sleep(800);
        sleep(800);
        id("action_send").click();
        sleep(10000);
        // 返回答案
        return id("action_button_icon").findOne().parent().parent().parent().parent().parent().findOne(className("android.widget.TextView").depth(15).indexInParent(0)).text().trim();
    }
}