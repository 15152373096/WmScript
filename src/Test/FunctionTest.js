let gameService = require('/sdcard/脚本/WmScript/src/service/GameService.js');
const deviceService = require("/sdcard/脚本/WmScript/src/service/DeviceService");
// let combo = require('/sdcard/脚本/WmScript/src/entrance/combo.js');


// combo.FaFaBrowse();

// gameService.shaWeiMa();
// click(850, 980);
// deviceService.comboTextClick([".", "0", "1", "确认"], 80);
// deviceService.clickDIP("android.view.View", 14, 9, 1000);


// deviceService.clickDIP("android.widget.TextView", 20, 10, 1000);
if (text("送TA机会").exists()) {
    // 只有一个账号
    if (text("173******96").exists()) {
        deviceService.clickNearBy("173******96", "送TA机会", 800);
    } else {
        deviceService.combinedClickText("更多好友", 2500);
        deviceService.clickBrotherIndex("173******96", 1, 500);
    }
}