let deviceService = require("/storage/emulated/0/脚本/WmScript/src/service/DeviceService.js");
let aliPayService = require("/storage/emulated/0/脚本/WmScript/src/service/AliPayService.js");
let doubaoService = require("/storage/emulated/0/脚本/WmScript/src/service/DoubaoService.js");
let combo = require("/storage/emulated/0/脚本/WmScript/src/entrance/Combo.js");

// 能量雨
// combo.takeEnergyRain("111", false);

// 偷能量
aliPayService.takeEnergy()

// // 海洋森林
// showText("android.widget.Button", 22, 1);
// // 蚂蚁庄园
// showText("android.widget.Button", 20, 0);
// 芭芭农场
// showText("android.widget.TextView", 19, 0);
// showText("android.widget.TextView", 20, 0);
// 蚂蚁森林
// showText("android.widget.Button", 22, 1);




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






function showText(clazzName, depthNumber, indexInParentNumber) {
    let buttons = className(clazzName).depth(depthNumber).indexInParent(indexInParentNumber).find();
    buttons.forEach(button => {
        log(button.text());
    })
}


/**
 * 拖动滑块还原拼图
 */
function restorePuzzle() {
    requestScreenCapture();
    sleep(3000);
    // var ima =
}

