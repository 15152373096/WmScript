// if (text("为保障您的正常访问请进行验证").exists() || text("请拖动滑块完成拼图").exists()) {
//     // 加载提示音
//     let mp = new android.media.MediaPlayer();
//     mp.setDataSource(context, android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_ALARM));
//     mp.prepare();
//     if (!mp.isPlaying()) {
//         mp.start();
//     }
//     // 震动两秒
//     device.vibrate(2000);
// }else{
//     log("1111")
// }

// log(device.width);



takeEnergy();
// punchChichen();




/**
 * 拖动滑块还原拼图
 */
function restorePuzzle() {
    requestScreenCapture();
    sleep(3000);
    // var ima =
}



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

function clickRate(k60X, k60Y, sleepTime) {
    // 设备参数
    let deviceWidth = device.width;
    let deviceHeight = device.height;
    click(deviceWidth * k60X / 1440, deviceHeight * k60Y / 3200);
    sleep(sleepTime);
}