// text = 为保障您的正常访问请进行验证
// text = 请拖动滑块完成拼图



takeEnergy();
// punchChichen();
function takeEnergy() {
    comboTextClick(["再来一次", "立即开启", "开启能量拯救之旅", "original"], 2000);
    let count = 0;
    while (true) {
        for (let i = 1; i < 8; i++) {
            press(device.width / 8 * i, device.height / 10, 10);
        }
        count += 80;
        if (text("恭喜获得").exists() || text("送TA机会").exists() || count > 30000) {
            break;
        }
    }
}
// 
// text = 欢乐揍小鸡 暴揍偷吃小鸡 每日首次得60g饲料可得1个宝箱 继续玩

function punchChichen() {
    comboTextClick(["original"], 2000);
    let count = 0;
    while (true) {
        for (let i = 1; i < 8; i++) {
            press(device.width / 8 * i, device.height / 10, 10);
        }
        count += 80;
        if (text("回到蚂蚁庄园 >").exists() || count > 30000) {
            text("恭喜获得").click();
            sleep(1000);
            break;
        }
    }
}

/**
 * 连续多文本点击
 * @param textNameArray
 * @param sleepTime
 */
function comboTextClick(textNameArray, sleepTime) {
    textNameArray.forEach(textName => {
        if (text(textName).exists()) {
            text(textName).click();
            sleep(sleepTime);
        }
    });
}

function swipeViewTask(keepTime) {
    let duration = 0;
    while (duration < keepTime) {
        gesture(3000, [device.width / 2, device.height / 4 * 3], [device.width / 2, device.height / 4], [device.width / 2, device.height / 4 * 3]);
        sleep(3000);
        duration += 3000;
    }
}