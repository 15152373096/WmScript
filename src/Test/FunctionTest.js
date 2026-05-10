let deviceService = require("/storage/emulated/0/脚本/WmScript/src/service/DeviceService.js");
let aliPayService = require("/storage/emulated/0/脚本/WmScript/src/service/AliPayService.js");
let douBaoService = require("/storage/emulated/0/脚本/WmScript/src/service/DouBaoService.js");
let taoBaoService = require("/storage/emulated/0/脚本/WmScript/src/service/TaoBaoService.js");
let combo = require("/storage/emulated/0/脚本/WmScript/src/entrance/Combo.js");


// 能量雨
// takeEnergyRain();
// 赚能量
// punchEnergy();
// 收能量
// aliPayService.takeEnergy();
// 种小麦
// combo.batchPlantWheat();

// engines.stopAll();
// deviceService.textMatchesClick(".*关闭震动.*", 800);
// log(device.width);


// if (textMatches("滑动浏览得.*").exists()) {
//     log("1111");
// }
// gamePlay(3)

// log(getCurrentUser())





functionTest();
function functionTest() {
    // 运动会
    // combo.playChickenSport()
    // aliPayService.initUserConfig("王明");
    // aliPayService.chickenTask()
    // aliPayService.happyLottery();
    // 鲸探任务
    // aliPayService.whaleExplorerTask()
    // deviceService.swipeViewTask(18000);

    // 冥想
    deviceService.back(6000);
    deviceService.textCoordinateClick("冥想", 945, 1380, 3000);
    deviceService.clickRate(720, 2550, 5000);
    deviceService.clickRate(720, 2865, 185000);
    deviceService.back(1000);
    deviceService.back(1000);
}

function gamePlay(mission) {
    // 拍摄
    if (mission == 1) {
        for (let i = 0; i < 60; i++) {
            press(1200, 2300, 60000);
        }
    }
    // 鼓舞
    if (mission == 2) {
        for (let i = 0; i < 600; i++) {
            click(720, 2165);
        }

    }
    // 叫号
    if (mission == 3) {
        for (let i = 0; i < 60; i++) {
            click(1200, 2720);
        }
    }
}

function isDeviceLocked() {
    try {
        importClass(android.app.KeyguardManager);
        importClass(android.content.Context);

        var km = context.getSystemService(Context.KEYGUARD_SERVICE);
        return km.isKeyguardLocked();
    } catch (e) {
        log("错误: " + e);
        return true; // 出错时默认返回锁定状态
    }
}


function goWuFuTask() {
    // 清除后台任务
    deviceService.clearBackground();
    // 启动支付宝
    deviceService.launch("支付宝");
    // 集五福
    deviceService.combinedClickText("搜索", 1000);
    setText("集五福");
    deviceService.combinedClickText("搜索", 1000);
    text("做任务得福卡").waitFor();
    sleep(1000);
    deviceService.comboTextClick(["做任务得福卡", "做任务得福卡"], 3000);
}


// ---------------------------------------------------------------------------------------------------------------------

function takeEnergyRain() {
    let globalConfig = deviceService.getGlobalConfig()
    let accountList = globalConfig.accountList;
    let currentUser = getCurrentUser();
    let currentAccount = {};
    for (let account of accountList) {
        if (currentUser == account.userName) {
            currentAccount = account;
            break;
        }
    }
    log("currentAccount", currentAccount);
    // 能量雨
    deviceService.comboTextClick(["拼手速赢", "限时抢收", "天降能量", "能量雨"], 5000);
    combo.takeEnergyRain(currentAccount.giveChanceUser, false);
    // 回到森林
    deviceService.back(800);
    // 关闭弹框
    deviceService.comboTextClick(["关闭", "关闭奖励弹窗"], 800);
    // 给主账号浇水
    if ("王明" != currentUser) {
        aliPayService.waterFriend("王明");
    }
    // 回到首页
    aliPayService.closeSubApp();
    // 切下一个账号
    aliPayService.switchAccount(currentAccount.nextUserAccount);
    aliPayService.launchSubApp("蚂蚁森林");
}

function getCurrentUser() {
    if (className("android.widget.TextView").depth(20).indexInParent(0).exists()) {
        let userName = className("android.widget.TextView").depth(20).indexInParent(0).findOne().text();
        return userName.length == 0 ? "王明" : userName;
    }
    if (className("android.widget.TextView").depth(19).indexInParent(1).exists()) {
        let userName = className("android.widget.TextView").depth(19).indexInParent(1).findOne().text();
        return userName.length == 0 ? "王明" : userName;
    }
    return "olly";
}

// ---------------------------------------------------------------------------------------------------------------------
// verifyPicture();
function verifyPicture() {
    // 截图保存
    deviceService.allowScreenCapture();
    let count = 0
    while (text("为保障您的正常访问请进行验证").exists() && count < 5) {
        count++;
        // 截图验证区域
        // captureVerification();
        // 识别解锁
        slideVerification();
    }
}

function captureVerification() {
    // 截取屏幕
    let screenshot = captureScreen();
    // 验证区域
    let bounds = className("android.view.View").depth(16).indexInParent(0).findOne().bounds();
    // 裁剪指定区域
    let clippedImage = images.clip(screenshot, bounds.left, bounds.top, bounds.width(), bounds.height());
    // 保存图片到指定路径
    images.save(clippedImage, "/sdcard/DCIM/Camera/autoJsTemp.png");
    // log(findGapX(clippedImage))
    // 释放图片内存
    screenshot.recycle();
    clippedImage.recycle();
}


function slideVerification() {

    // 截取屏幕
    let screenshot = captureScreen();
    // 验证区域
    let clippedBounds = className("android.view.View").depth(16).indexInParent(0).findOne().bounds();
    // 裁剪指定区域
    let clippedImage = images.clip(screenshot, clippedBounds.left, clippedBounds.top, clippedBounds.width(), clippedBounds.height());
    log("-------------------222--------------------------------------");
    let distance = findGapX(clippedImage);
    log("--------------------333-------------------------------------");
    log("distance", distance);
    log("-----------------------444----------------------------------");
    // 释放图片内存
    screenshot.recycle();
    clippedImage.recycle();
    let bounds = className("android.widget.TextView").depth(18).indexInParent(2).findOne().bounds();
    let fromX = bounds.centerX();
    let y = bounds.centerY();
    humanSwipe(fromX, y, bounds.left + distance, y)
    sleep(3600);
}

/**
 * 高精度通用滑块缺口识别（基于横向梯度）
 * @param {Image} img - 滑块背景图
 * @returns {number} 缺口最左侧X坐标
 */
function findGapX(img) {
    var width = img.getWidth();
    var height = img.getHeight();

    // 分析区域：避开顶部/底部UI
    var startY = Math.floor(height * 0.25);
    var endY = Math.floor(height * 0.75);
    var h = endY - startY;

    // 采样提速
    var stepY = 3; // 每3行采一个点

    // 计算每一列的平均亮度
    var brightness = [];
    for (var x = 0; x < width; x++) {
        var sumY = 0, count = 0;
        for (var y = startY; y < endY; y += stepY) {
            var c = images.pixel(img, x, y);
            var r = (c >> 16) & 0xFF;
            var g = (c >> 8) & 0xFF;
            var b = c & 0xFF;
            var Y = 0.299 * r + 0.587 * g + 0.114 * b;
            sumY += Y;
            count++;
        }
        brightness[x] = count > 0 ? sumY / count : 0;
    }

    // 计算横向梯度（当前列 - 左侧列）
    var gradient = [];
    for (var x = 1; x < width; x++) {
        gradient[x] = brightness[x] - brightness[x - 1];
    }

    // 找“正向跳变最大”的位置（缺口左侧：右边比左边亮 or 结构突变）
    var bestX = -1;
    var maxGrad = -Infinity;

    // 搜索范围：避开滑块和右边缘
    var startX = Math.floor(width * 0.35);
    var endX = Math.floor(width * 0.85);

    for (var x = startX; x <= endX; x++) {
        // 使用局部最大值（避免噪声）
        if (x >= 5 && x < width - 5) {
            var isPeak = true;
            for (var dx = 1; dx <= 3; dx++) {
                if (gradient[x] <= gradient[x - dx] || gradient[x] <= gradient[x + dx]) {
                    isPeak = false;
                    break;
                }
            }
            if (isPeak && gradient[x] > maxGrad) {
                maxGrad = gradient[x];
                bestX = x;
            }
        }
    }

    // 如果没找到峰值，回退到最大梯度
    if (bestX === -1) {
        for (var x = startX; x <= endX; x++) {
            if (gradient[x] > maxGrad) {
                maxGrad = gradient[x];
                bestX = x;
            }
        }
    }

    return bestX;
}


/**
 * 模拟人手滑动（防机器人检测）
 * @param {number} fromX 起始X
 * @param {number} fromY 起始Y
 * @param {number} toX   目标X
 * @param {number} toY   目标Y
 */
function humanSwipe(fromX, fromY, toX, toY) {
    // 计算总距离
    var dx = toX - fromX;
    var dy = toY - fromY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // 滑动时间：距离越长，耗时越长（但非线性）
    var duration = Math.min(2400, Math.max(1200, distance * 3.6)); // 单位：毫秒

    // 生成贝塞尔控制点（模拟人手先快后慢）
    var cx1 = fromX + dx * 0.3 + randomOffset(10);
    var cy1 = fromY + dy * 0.3 + randomOffset(5);
    var cx2 = fromX + dx * 0.7 + randomOffset(10);
    var cy2 = fromY + dy * 0.7 + randomOffset(5);

    // 构造路径点（起点 -> 控制点1 -> 控制点2 -> 终点）
    var points = [
        [fromX, fromY],
        [cx1, cy1],
        [cx2, cy2],
        [toX, toY]
    ];

    // 执行手势（Auto.js 4.1.1 支持 gesture(duration, ...points)）
    gesture.apply(null, [duration].concat(points));
}

// 辅助函数：生成微小随机偏移（模拟手抖）
function randomOffset(max) {
    return (Math.random() * 2 - 1) * max;
}

// ---------------------------------------------------------------------------------------------------------------------
function punchEnergy() {
    deviceService.comboTextClick(["赚能量", "大丰收！", "能量++", "限时UP↑"], 3000);
    let playTime = 0;
    while (true) {
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        press(295 * deviceWidth / 1440, 1880 * deviceHeight / 3200, 100);
        press(720 * deviceWidth / 1440, 1880 * deviceHeight / 3200, 100);
        press(1165 * deviceWidth / 1440, 1880 * deviceHeight / 3200, 100);

        press(295 * deviceWidth / 1440, 2200 * deviceHeight / 3200, 100);
        press(720 * deviceWidth / 1440, 2200 * deviceHeight / 3200, 100);
        press(1165 * deviceWidth / 1440, 2200 * deviceHeight / 3200, 100);

        press(295 * deviceWidth / 1440, 2540 * deviceHeight / 3200, 100);
        press(720 * deviceWidth / 1440, 2540 * deviceHeight / 3200, 100);
        press(1165 * deviceWidth / 1440, 2540 * deviceHeight / 3200, 100);
        playTime += 180;
        if (playTime > 8000 || text("恭喜获得").exists()) {
            toast("停止敲打");
            break;
        }
    }

}

// ---------------------------------------------------------------------------------------------------------------------

// 海洋森林
// showText("android.widget.Button", 22, 1);
// 蚂蚁庄园
// showText("android.widget.Button", 20, 0);
// 芭芭农场
// showText("android.view.View", 17, 0);
// 蚂蚁森林
// showText("android.widget.Button", 22, 1);
// 蚂蚁森林
// showText("android.widget.Button", 21, 0);
// 签到任务
// showText("android.widget.TextView", 18, 1);

function showText(clazzName, depthNumber, indexInParentNumber) {
    let buttons = className(clazzName).depth(depthNumber).indexInParent(indexInParentNumber).find();
    buttons.forEach(button => {
        log(button.text());
    })
}

