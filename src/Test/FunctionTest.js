const deviceService = require("/sdcard/脚本/WmScript/src/service/DeviceService");
const aliPayService = require("/sdcard/脚本/WmScript/src/service/AliPayService");

takeEnergy();
// pickUpSign();
// engines.stopAll();

// 拍摄
// for (let i = 1; i < 3; i++) {
//     press(1210, 2300, 50000);
// }

// while(true) {
//     // 打鼓
//     // deviceService.clickRate(720 / 1440, 2100 / 3200, 100);

//     // 宣传
//     // deviceService.clickRate(1285 / 1440, 2750 / 3200, 500);
// }

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