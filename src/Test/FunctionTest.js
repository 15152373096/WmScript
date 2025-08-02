let deviceService = require("/storage/emulated/0/脚本/WmScript/src/service/DeviceService.js");
let aliPayService = require("/storage/emulated/0/脚本/WmScript/src/service/AliPayService.js");
let doubaoService = require("/storage/emulated/0/脚本/WmScript/src/service/DoubaoService.js");
let taoBaoService = require("/storage/emulated/0/脚本/WmScript/src/service/TaoBaoService.js");
let combo = require("/storage/emulated/0/脚本/WmScript/src/entrance/Combo.js");

// 能量雨
combo.takeEnergyRain("王明", false);

// // 海洋森林
// showText("android.widget.Button", 22, 1);
// // 蚂蚁庄园
// showText("android.widget.Button", 20, 0);
// 芭芭农场
// showText("android.widget.TextView", 19, 0);
// showText("android.widget.TextView", 20, 0);
// 蚂蚁森林
// showText("android.widget.Button", 22, 1);
// 蚂蚁森林
// showText("android.widget.TextView", 17, 1);

// log(device.width)

// humanSwipe(100, 2000, 1400, 3000)

function humanSwipe(startX, startY, endX, endY) {
    let totalDistance = endX - startX;
    let currentX = startX;
    let duration = 500; // 总耗时(ms)
    let intervals = 20; // 分割段数

    // 初始按压滑块
    press(startX, startY, duration);

    // 生成变速轨迹点（先快后慢）
    let points = [];
    for (let i = 0; i <= intervals; i++) {
        let progress = i / intervals;
        // 非线性进度（模拟人手先快后慢）
        let factor = (progress < 0.7) ? progress * 1.2 : progress * 0.5;
        let x = startX + Math.round(totalDistance * factor);
        // 添加垂直抖动（±3像素）
        let yOffset = (i % 3 === 0) ? random(-3, 3) : 0;
        points.push([x, startY + yOffset]);
    }

    // 执行分段滑动
    points.forEach((point, index) => {
        if (index > 0) {
            swipe(points[index - 1][0], points[index - 1][1], point[0], point[1], 20);
            sleep(random(20, 50)); // 随机停顿
        }
    });
}


function showText(clazzName, depthNumber, indexInParentNumber) {
    let buttons = className(clazzName).depth(depthNumber).indexInParent(indexInParentNumber).find();
    buttons.forEach(button => {
        log(button.text());
    })
}

