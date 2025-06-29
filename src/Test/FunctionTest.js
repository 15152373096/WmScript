// comboTextClick(["我的"], 5000);
takeEnergy();
function takeEnergy() {
    comboTextClick(["再来一次", "立即开启", "开启能量拯救之旅"], 2000);
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