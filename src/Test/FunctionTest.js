let deviceService = require("/storage/emulated/0/脚本/WmScript/src/service/DeviceService.js");
let aliPayService = require("/storage/emulated/0/脚本/WmScript/src/service/AliPayService.js");
let douBaoService = require("/storage/emulated/0/脚本/WmScript/src/service/DouBaoService.js");
let taoBaoService = require("/storage/emulated/0/脚本/WmScript/src/service/TaoBaoService.js");
let combo = require("/storage/emulated/0/脚本/WmScript/src/entrance/Combo.js");


// punchEnergy()
// aliPayService.takeEnergy()

// 能量雨
takeEnergyRain()

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
        return className("android.widget.TextView").depth(20).indexInParent(0).findOne().text();
    }
    if (className("android.widget.TextView").depth(19).indexInParent(1).exists()) {
        return className("android.widget.TextView").depth(19).indexInParent(1).findOne().text();
    }
    return "olly";
}

// functionTest();
function functionTest() {
    // 截图保存
    deviceService.allowScreenCapture();
    let count = 0
    while (text("为保障您的正常访问请进行验证").exists() && count < 5) {
        // 解锁
        slideVerification();
    }
}

function slideVerification() {
    // 截取屏幕
    let img = captureScreen();
    // 保存图片到指定路径
    images.save(img, "/sdcard/DCIM/Camera/autoJsTemp.png");
    // 回收图片资源
    img.recycle();

    app.launchApp("相册");
    sleep(3600);
    deviceService.back(1000);
    app.launchApp("相册");
    sleep(3600);
    // 点击文件
    deviceService.clickRate(200, 800, 1800)
    // 发送
    deviceService.combinedClickText("发送", 1800)
    deviceService.combinedClickDesc("豆包", 5000);

    let queryDate = deviceService.formatDate(new Date());
    let randomKey = deviceService.getRandomNumber(1, 100);

    // 找答案
    let questionText = "这是一个滑块验证码的图片，你计算一下拼图滑块缺口目标位置到拼图滑块的距离相对整个截图宽度的比例发给我，" +
        "给我格式是：{日期}-" + randomKey + "-with-{滑动距离比例}。" +
        "其中{日期}和{滑动距离比例}是需要替换的部分，" +
        "{日期}替换成当前日期格式为yyyy-MM-dd，" +
        "{滑动距离比例}是拼图滑块缺口目标位置最左边到拼图滑块最左边的距离除以整个截图宽度的比例，保留两位小数";
    setText(questionText);
    sleep(1800);
    if (id("action_send").exists()) {
        id("action_send").click();
    } else {
        click(1295, 1815);
    }
    sleep(6000);
    // 返回答案
    let matchKey = queryDate.formatDay + '-' + randomKey + '-with-';
    let answer = textMatches('.*' + matchKey + '.*').findOne().text().trim().replace(matchKey, '');
    if (answer.indexOf('\n') > 0) {
        answer = answer.substring(0, answer.indexOf('\n'));
    }
    log('queryTodayChickenAnswer >> answer is ' + answer);
    deviceService.launch("支付宝");
    // let distance = answer * device.width;
    let distance = answer * 1064;
    let bounds = className("android.widget.TextView").depth(18).indexInParent(2).findOne().bounds();
    let fromX = bounds.centerX();
    let y = bounds.centerY();

    // swipe(fromX, y, toX, y, 1800);
    humanSwipe(fromX, y, fromX + distance, y)
    // gesture(2400, [fromX, y], [(fromX + toX) / 2, y - 25], [fromX + ((toX - fromX) * 3 / 4), y + 25], [toX, y]);
    sleep(3600);
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
    var duration = Math.min(1200, Math.max(600, distance * 1.8)); // 单位：毫秒

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


// 海洋森林
// showText("android.widget.Button", 22, 1);
// 蚂蚁庄园
// showText("android.widget.Button", 20, 0);
// 芭芭农场
// showText("android.view.View", 17, 0);
// 蚂蚁森林
// showText("android.widget.Button", 22, 1);
// 蚂蚁森林
// showText("android.widget.Button", 22, 1);
// 签到任务
// showText("android.widget.TextView", 18, 1);

function showText(clazzName, depthNumber, indexInParentNumber) {
    let buttons = className(clazzName).depth(depthNumber).indexInParent(indexInParentNumber).find();
    buttons.forEach(button => {
        log(button.text());
    })
}

