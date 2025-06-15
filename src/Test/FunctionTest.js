const deviceService = require("/sdcard/脚本/WmScript/src/service/DeviceService");
const aliPayService = require("/sdcard/脚本/WmScript/src/service/AliPayService");
const combo = require("/sdcard/脚本/WmScript/src/entrance/Combo");

// if (deviceService.appExists("豆包")) {
//     deviceService.launch("豆包");
//     setText("蚂蚁庄园今日答案，直接给我答案就行，不要多余的字，用逗号分割");
//     sleep(2000);
//     deviceService.clickRate(1315 / 1440, 3010 / 3200, 5000);
// }
// // deviceService.clickDIP("android.widget.ImageView", 18, 8, 1000);

// clickRate(1295, 3010);


deviceService.combinedClickText("立即领取", 5000)












// timeTask(1);
function timeTask(type) {
    if (0 == type) {
        engines.stopAll();
    }
    // 收能量
    if (1 == type) {
        takeEnergy();
    }
    // 补签
    if (2 == type) {
        pickUpSign();
    }
    // 宣传
    if (3 == type) {
        for (let i = 1; i < 600; i++) {
            deviceService.clickRate(1285 / 1440, 2750 / 3200, 500);
        }
    }
    // combo
    if (4 == type) {
        combo.mainJob();
    }
}

function takeEnergy() {
    deviceService.comboTextClick(["再来一次", "立即开启", "开启能量拯救之旅"], 2000);
    let count = 0;
    while (true) {
        for (let i = 1; i < 8; i++) {
            press(device.width / 8 * i, device.height / 10, 10);
        }
        count += 80;
        if (text("恭喜获得").exists() || text("送TA机会").exists() || count > 30000) {
            log("========end=======");
            break;
        }
    }
}

function pickUpSign() {
    for (let i = 1; i < 100; i++) {
        deviceService.comboTextClick(["补签卡"], 2000);
        // deviceService.comboTextClick(["我要补签"], 2000);
        deviceService.clickRate(720 / 1440, 2000 / 3200, 2000);
        let array = [
            "6.使用补签卡后，次日签到获得的积分将按照最新连续签到天数进行计算。",
            "6.使用补签卡后，次日签到获得的积分将按照最新连续签到天数进行计算。",
            "去使用",
            "补签卡X1",
            "推荐补签"
        ];
        deviceService.comboTextClick(array, 3000);
        deviceService.clickRate(720 / 1440, 2000 / 3200, 2000);
        sleep(3000);
    }
}