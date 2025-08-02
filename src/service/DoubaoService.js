// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {

    /**
     * 初始化蚂蚁庄园答案
     */
    initChickenAnswer: function () {
        if (!deviceService.appExists("豆包")) {
            return;
        }
        let askTextList = [
            "蚂蚁庄园今日答案，直接给我答案就行，不要多余的字，用逗号分割",
            "蚂蚁庄园明日答案，直接给我答案就行，不要多余的字，用逗号分割"
        ]
        askTextList.forEach(askText => {
            deviceService.launch("豆包");
            setText(askText);
            id("action_send").click();
            sleep(10000);
            // 复制答案
            click(170, 2520);
            sleep(2000);
            // 打开
            app.openUrl("http://101.126.83.165:8081/index");
            sleep(6000);
            if (text("登录").exists()) {
                setText(1, "15152373096");
                sleep(800);
                setText(2, "ming0935");
                sleep(800);
                deviceService.combinedClickText("登录", 6000);
            }
            deviceService.combinedClickText("答案维护", 6000);
            // 获取答案列表
            className("android.widget.EditText").find()[1].click();
            sleep(2000);
            // 粘贴
            deviceService.clickRate(1280, 3100, 1000);
            deviceService.clickRate(720, 2240, 1000);
            // 答案
            let answers = className("android.widget.EditText").find()[1].text();
            // 没有答案的，跳过
            if (answers.indexOf("无法提供") > 0) {
                return;
            }
            // 分割答案
            let answerArray = answers.split(",");
            // 日期
            let submitDate = deviceService.formatDate(new Date()).formatDay;
            // 遍历提交答案
            for (let i = 0; i < answerArray.length; i += 2) {
                if ("蚂蚁庄园今日答案，直接给我答案就行，不要多余的字，用逗号分割" == askText) {
                    setText(0, submitDate);
                    sleep(800);
                }
                setText(1, answerArray[i]);
                sleep(800);
                if (i + 1 < answerArray.length) {
                    setText(2, answerArray[i + 1]);
                    sleep(800);
                }
                deviceService.comboTextClick(["提交", "确定"], 1000);
                // 下拉刷新
                deviceService.swipeDown(device.height);
            }
        });
        home();
    }
}