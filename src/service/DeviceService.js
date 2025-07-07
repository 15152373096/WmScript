let globalConfigPath = "/sdcard/脚本/WmScript/resource/config/device/" + device.model + ".json";

module.exports = {

    /**
     * 切换开关
     */
    changeSwitch: function (switchValue) {
        let globalConfig = this.getGlobalConfig();
        if (globalConfig.globalSwitch != switchValue) {
            log("======change Switch,oldValue=" + globalConfig.globalSwitch + ",newValue=" + switchValue + "======");
            globalConfig.globalSwitch = switchValue;
            this.updateConfig(globalConfig);
        }
    },

    /**
     * 更新上次运行时间
     */
    updateLastRunTime: function () {
        // 当前时间
        let now = new Date();
        let currentTime = this.formatDate(now);
        let globalConfig = this.getGlobalConfig();
        globalConfig.mainJobConfig.lastRunTime = currentTime.formatSecond;
        this.updateConfig(globalConfig);
    },

    /**
     * 更新配置
     * @param globalConfig
     */
    updateConfig: function (globalConfig) {
        files.write(globalConfigPath, JSON.stringify(globalConfig));
    },

    /**
     * 获取配置
     */
    getGlobalConfig: function () {
        let jsonString = files.read(globalConfigPath);
        return JSON.parse(jsonString);
    },

    /**
     * 唤醒设备
     */
    wakeUpDevice: function () {
        // 如果设备是开着的，跳过
        if (device.isScreenOn()) {
            return;
        }
        // 唤醒
        device.wakeUp();
        sleep(1000);
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        swipe(deviceWidth / 2, deviceHeight * 4 / 5, deviceWidth / 2, deviceHeight / 8, 1000);
        sleep(2000);
        // 畅享50Z
        if ("EVE-AL00" == device.model) {
            this.comboTextClick(["5", "9", "4", "6", "0", "6"], 80);
        }
        // K20
        if ("Redmi K20 Pro" == device.model) {
            // unlock
            let xLeft = 250;
            let yBottom = 1785;
            let yMiddle = 1500;
            let yTop = 1215;
            gesture(1000, [xLeft, yBottom], [xLeft, yTop], [deviceWidth / 2, yMiddle], [deviceWidth - xLeft, yTop], [deviceWidth - xLeft, yBottom]);
        }
        // K60
        if ("23013RK75C" == device.model) {
            let xLeft = 365;
            let yBottom = 2645;
            let yMiddle = 2290;
            let yTop = 1935;
            gesture(1000, [xLeft, yBottom], [xLeft, yTop], [deviceWidth / 2, yMiddle], [deviceWidth - xLeft, yTop], [deviceWidth - xLeft, yBottom]);
        }
        sleep(2000);
        this.stopOtherJob();
    },

    /**
     * 设备锁屏
     */
    lockDevice: function () {
        // 如果设备是关着的，跳过
        if (!device.isScreenOn()) {
            return;
        }
        // 回首页
        home();
        sleep(1000);
        // 锁屏
        let success = runtime.accessibilityBridge.getService().performGlobalAction(
            android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN
        );
        if (!success) {
            toastLog("锁屏失败，请检查权限");
        }
        // 关闭其他线程
        threads.shutDownAll();
    },

    /**
     * 停止其他脚本
     */
    stopOtherJob: function () {
        let currentJob = engines.myEngine();
        let jobs = engines.all();
        log("正在运行的脚本有", jobs.length, "个");
        jobs.forEach(job => {
            if (job.toString() != currentJob.toString()) {
                log("停止脚本", job.toString());
                job.forceStop();
            }
        });
    },

    /**
     * 允许截图
     */
    allowScreenCapture: function () {
        // 允许截图
        threads.start(function () {
            sleep(1000);
            log("--允许截图线程--start--");
            let allowFlag = false;
            while (!allowFlag) {
                if (className("android.widget.Button").text("立即开始").exists()) {
                    className("android.widget.Button").text("立即开始").findOne().click();
                    allowFlag = true;
                } else if (text("要开始使用Autox.js v6录制或投放吗？").exists() && className("android.widget.Button").text("取消").exists()) {
                    let bounds1 = text("单个应用").findOne().bounds();
                    click(bounds1.centerX(), bounds1.centerY());
                    sleep(800);
                    let bounds2 = text("整个屏幕").findOne().bounds();
                    click(bounds2.centerX(), bounds2.centerY());
                    sleep(800);
                    let bounds = className("android.widget.Button").text("取消").findOne().bounds();
                    click(bounds.centerX() + device.width * 5 / 10, bounds.centerY());
                    allowFlag = true;
                } else if (text("要开始使用Autox.js v6录制或投放内容吗？").exists() && className("android.widget.Button").text("取消").exists()) {
                    let bounds = className("android.widget.Button").text("取消").findOne().bounds();
                    click(bounds.centerX() + device.width * 5 / 10, bounds.centerY());
                    allowFlag = true;
                } else if (text("允许").exists()) {
                    text("允许").click();
                    allowFlag = true;
                }
                sleep(2000)
            }
            log("--允许截图线程--end--");
        });
        if (!requestScreenCapture()) {
            toastLog("---请求截图失败---");
        }
    },

    /**
     *  清理后台应用
     */
    clearBackground: function () {
        // 如果设备是关着的，跳过
        if (!device.isScreenOn()) {
            return;
        }
        // 设备参数
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        // 回首页
        home();
        sleep(1000);
        // 最近任务
        recents();
        sleep(2000);
        // 清理任务
        if (id("clearAnimView").exists()) {
            id("clearAnimView").findOne().click();
        } else {
            click(deviceWidth / 2, deviceHeight / 100 * 92)
        }
        sleep(1000);
    },

    /**
     * 判断APP是否存在
     * @param {String} appName 应用名称
     */
    appExists: function (appName) {
        return null != app.getPackageName(appName);
    },

    /**
     * 加载应用
     * @param {String} appName 应用名称
     */
    launch: function (appName) {
        toast("打开" + appName);
        app.launchApp(appName);
        sleep(5000);
    },

    /**
     * 关闭应用
     * @param {String} appName 应用名称
     */
    unlaunch: function (appName) {
        app.openAppSetting(app.getPackageName(appName));
        sleep(1000);
        click("结束运行");
        sleep(500);
        click("确定");
        sleep(500);
        home();
    },

    /**
     * 重启应用
     * @param {String} appName 应用名称
     */
    reboot: function (appName) {
        this.unlaunch(appName);
        this.launch(appName);
    },

    /**
     * 静音
     */
    mute: function () {
        // 记录当前声音，用于恢复
        let volumeArray = new Array(3);
        volumeArray[0] = device.getMusicVolume();
        volumeArray[1] = device.getNotificationVolume();
        volumeArray[2] = device.getAlarmVolume();
        // 静音
        device.setMusicVolume(0);
        device.setNotificationVolume(0);
        device.setAlarmVolume(0);
        return volumeArray;
    },

    /**
     * 回退静音
     */
    revertMute: function (volumeArray) {
        device.setMusicVolume(volumeArray[0]);
        device.setNotificationVolume(volumeArray[1]);
        device.setAlarmVolume(volumeArray[2]);
    },


    /**
     * 获取className数组
     * @returns {string[]}
     */
    getCombinedClassName: function () {
        return [
            "android.widget.Button",
            "android.view.View",
            "android.widget.TextView",
            "android.widget.FrameLayout",
            "android.widget.ImageView",
            "android.widget.Image"
        ];
    },

    /**
     * 连续多文本
     * @param textNameArray
     * @param sleepTime
     */
    comboTextClick: function (textNameArray, sleepTime) {
        textNameArray.forEach(textName => {
            this.combinedClickText(textName, sleepTime);
        });
    },

    /**
     * 联合点击事件
     * @param textValue
     * @param sleepTime
     */
    combinedClickText: function (textValue, sleepTime) {
        // 获取className数组
        let classNameArray = this.getCombinedClassName();
        // 遍历
        for (let itemClassName of classNameArray) {
            if (className(itemClassName).text(textValue).exists()) {
                // 控件可点击，直接点击
                if (className(itemClassName).text(textValue).findOne().clickable()) {
                    log("className=" + itemClassName + "; text=" + textValue + "; clickable is true!");
                    className(itemClassName).text(textValue).findOne().click();
                    sleep(sleepTime);
                    return;
                } else {
                    log("className=" + itemClassName + "; text=" + textValue + "; clickable is false!");
                    let bounds = className(itemClassName).text(textValue).findOne().bounds();
                    // 如果超出界面滑动
                    if (bounds.centerY() > device.height * 99 / 100) {
                        this.swipeUp(bounds.centerY() - device.height * 90 / 100);
                        this.combinedClickText(textValue, sleepTime);
                    } else {
                        click(bounds.centerX(), bounds.centerY());
                        sleep(sleepTime);
                        return;
                    }
                }
            }
        }
        // 不带className
        if (text(textValue).exists()) {
            log("without className; text=" + textValue + "; exists!");
            text(textValue).findOne().click();
            sleep(sleepTime);
        }
    },

    /**
     * 连续多文本
     * @param descValueArray
     * @param sleepTime
     */
    comboDescClick: function (descValueArray, sleepTime) {
        descValueArray.forEach(descValue => {
            this.combinedClickDesc(descValue, sleepTime);
        });
    },

    /**
     * 联合点击事件
     * @param descValue
     * @param sleepTime
     */
    combinedClickDesc: function (descValue, sleepTime) {
        // 获取className数组
        let classNameArray = this.getCombinedClassName();
        // 遍历
        for (let itemClassName of classNameArray) {
            if (className(itemClassName).desc(descValue).exists()) {
                // 控件可点击，直接点击
                if (className(itemClassName).desc(descValue).findOne().clickable()) {
                    log("className=" + itemClassName + "; desc=" + descValue + "; clickable is true!");
                    className(itemClassName).desc(descValue).findOne().click();
                    sleep(sleepTime);
                    return;
                } else {
                    log("className=" + itemClassName + "; desc=" + descValue + "; clickable is false!");
                    let bounds = className(itemClassName).desc(descValue).findOne().bounds();
                    // 如果超出界面滑动
                    if (bounds.centerY() > device.height * 99 / 100) {
                        this.swipeUp(bounds.centerY() - device.height * 90 / 100);
                        this.combinedClickDesc(descValue, sleepTime);
                    } else {
                        click(bounds.centerX(), bounds.centerY());
                        sleep(sleepTime);
                        return;
                    }
                }
            }
        }
        // 不带className
        if (desc(descValue).exists()) {
            log("without className; descValue=" + descValue + "; exists!");
            desc(descValue).findOne().click();
            sleep(sleepTime);
        }
    },

    /**
     * 如果存在按钮，则点击
     * @param {string} clazzName
     * @param {number} depth
     * @param {number} indexInParent
     * @param {number} sleepTime
     */
    clickDIP: function (clazzName, depth, indexInParent, sleepTime) {
        if (className(clazzName).depth(depth).indexInParent(indexInParent).exists()) {
            if (className(clazzName).depth(depth).indexInParent(indexInParent).findOne().isClickable()) {
                log("className=" + clazzName + "; depth=" + depth + "; indexInParent=" + indexInParent + "; clickable is true!");
                className(clazzName).depth(depth).indexInParent(indexInParent).click();
            } else {
                log("className=" + clazzName + "; depth=" + depth + "; indexInParent=" + indexInParent + "; clickable is false!");
                let bounds = className(clazzName).depth(depth).indexInParent(indexInParent).findOne().bounds();
                click(bounds.centerX(), bounds.centerY());
            }
            sleep(sleepTime);
        }
    },

    /**
     * 如果存在按钮，则点击
     * @param {string} textName 按钮名称
     * @param {number} sleepTime 休眠时间
     */
    clickBrotherIndex: function (textName, brotherGap, sleepTime) {
        if (text(textName).exists()) {
            let locate = text(textName).findOne();
            let bounds = depth(locate.depth()).indexInParent(locate.indexInParent() + brotherGap).findOne().bounds();
            // 如果超出界面滑动
            if (bounds.centerY() > device.height * 98 / 100) {
                this.swipeUp(bounds.centerY() - device.height * 90 / 100);
                this.clickBrotherIndex(textName, brotherGap, sleepTime);
            } else {
                click(bounds.centerX(), bounds.centerY());
                sleep(sleepTime);
            }
        }
    },

    /**
     * 播放提示音
     */
    playNotice: function () {
        // 加载提示音
        let mp = new android.media.MediaPlayer();
        mp.setDataSource(context, android.media.RingtoneManager.getDefaultUri(android.media.RingtoneManager.TYPE_ALARM));
        mp.prepare();
        if (!mp.isPlaying()) {
            mp.start();
        }
        // if (mp.isPlaying()) {
        //     mp.stop();
        // }

    },

    /**
     * 点击locate附近的target
     * @param {string} textName
     * @param {string} targetTextName
     * @param {number} sleepTime
     * @returns
     */
    clickNearBy: function (textName, targetTextName, sleepTime) {
        if (text(textName).exists() && text(targetTextName).exists() && text(textName).findOne().parent().findOne(text(targetTextName))) {
            text(textName).findOne().parent().findOne(text(targetTextName)).click();
            sleep(sleepTime);
            return;
        }
        if (text(textName).exists() && text(targetTextName).exists() && text(textName).findOne().parent().parent().findOne(text(targetTextName))) {
            text(textName).findOne().parent().parent().findOne(text(targetTextName)).click();
            sleep(sleepTime);
            return;
        }
        if (text(textName).exists() && text(targetTextName).exists() && text(textName).findOne().parent().parent().parent().findOne(text(targetTextName))) {
            text(textName).findOne().parent().parent().parent().findOne(text(targetTextName)).click();
            sleep(sleepTime);
        }
    },

    /**
     * 按照K60设备比例点击
     * @param {number} k60X
     * @param {number} k60Y
     * @param {number} sleepTime
     */
    clickRate: function (k60X, k60Y, sleepTime) {
        // 设备参数
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        click(deviceWidth * k60X / 1440, deviceHeight * k60Y / 3200);
        sleep(sleepTime);
    },

    /**
     * 判断图片是否存在
     * @param {String} lookupImage
     */
    imageExist: function (lookupImage) {
        let p = images.findImage(images.captureScreen(), lookupImage, { threshold: 0.9 });
        if (p) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 点击图片
     * @param {String} lookupImage
     * @param {number} sleepTime
     */
    clickImage: function (lookupImage, sleepTime) {
        let p = images.findImage(images.captureScreen(), lookupImage, { threshold: 0.9 });
        if (p) {
            click(p.x + lookupImage.getWidth() / 2, p.y + lookupImage.getHeight() / 2);
            sleep(sleepTime);
        }
    },

    /**
     * 点击指定区域图片
     * @param {String} lookupImage
     * @param {number} sleepTime
     */
    clickAreaImage: function (lookupImage, x, y, sleepTime) {
        let p = images.findImage(images.captureScreen(), lookupImage, {
            region: [x, y, device.width, device.height - y],
            threshold: 0.95
        });
        if (p) {
            click(p.x + lookupImage.getWidth() / 2, p.y + lookupImage.getHeight() / 2);
            sleep(sleepTime);
        }
    },

    /**
     * 上滑展示下一页
     */
    swipeUp: function (height) {
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        let distance = height > device.height / 2 ? device.height / 2 : height;
        swipe(deviceWidth / 2, deviceHeight * 7 / 8, deviceWidth / 2, deviceHeight * 7 / 8 - distance, 200);
        sleep(1600);
    },

    /**
     * 下滑展示下一页
     */
    swipeDown: function (height) {
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        swipe(deviceWidth / 2, deviceHeight / 2, deviceWidth / 2, deviceHeight / 2 + height, 200);
        sleep(2000);
    },

    /**
     * 获取随机数
     * @param min
     * @param max
     * @returns {*}
     */
    getRandomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 字符串转时间
     * @param dateString
     * @returns {Date}
     */
    stringToDate: function (dateString) {
        let parts = dateString.split(' ');
        let dateParts = parts[0].split('-');
        let timeParts = parts[1].split(':');

        // JavaScript中的月份是从0开始的，所以需要减1
        let year = parseInt(dateParts[0], 10);
        let month = parseInt(dateParts[1], 10) - 1;
        let day = parseInt(dateParts[2], 10);
        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10);
        let seconds = parseInt(timeParts[2], 10);

        return new Date(year, month, day, hours, minutes, seconds);
    },

    /**
     * 格式化时间
     * @param date
     * @returns {{formatSecond: string, formatDay: string}}
     */
    formatDate: function (date) {
        const year = String(date.getFullYear());
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        const hour = this.padZero(date.getHours());
        const minute = this.padZero(date.getMinutes());
        const second = this.padZero(date.getSeconds());
        return {
            formatDay: year + '-' + month + '-' + day,
            formatMinute: year + '-' + month + '-' + day + " " + hour + ":" + minute,
            formatSecond: year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second,
            hourMinute: hour + ":" + minute,
        };
    },

    /**
     * 补零
     * @param num
     * @returns {string|string}
     */
    padZero: function (num) {
        // 统一转为字符串
        const str = String(num);

        // 判断是否需要补零
        return str.length >= 2 ? str : '0' + str;
    },

    /**
     * 是否早于hour时minute分
     * @param {number} hour
     * @param {number} minute
     * @returns boolean
     */
    earlierThan: function (hour, minute) {
        let now = new Date();
        let compareTime = new Date();
        compareTime.setHours(hour);
        compareTime.setMinutes(minute);
        compareTime.setSeconds(0);
        return now < compareTime;
    },

    /**
     * 是否晚于hour时minute分
     * @param {number} hour
     * @param {number} minute
     * @returns boolean
     */
    laterThan: function (hour, minute) {
        let now = new Date();
        let compareTime = new Date();
        compareTime.setHours(hour);
        compareTime.setMinutes(minute);
        compareTime.setSeconds(0);
        return now > compareTime;
    },

    /**
     * 获取时间差
     * @param date1
     * @param date2
     * @returns {{hours: number, seconds: number, minutes: number, days: number}}
     */
    getTimeDifference: function (date1, date2) {
        // 计算时间差，单位毫秒
        const diff = date2.getTime() - date1.getTime();
        return {
            days: diff / (1000 * 60 * 60 * 24),
            hours: diff / (1000 * 60 * 60),
            minutes: diff / (1000 * 60),
            seconds: diff / 1000,
        };
    },

    /**
     * 判断是否包含再数组总
     * @param array
     * @param item
     */
    containsInArray: function (array, item) {
        for (let arrayElement of array) {
            if (arrayElement == item) {
                return true;
            }
        }
        return false;
    },

    /**
     * 下滑浏览任务
     */
    swipeViewTask: function (keepTime) {
        let finishTextArray = [
            "已完成 可领奖励",
            "已完成 可领饲料",
            "任务已完成，恭喜获得奖励！",
            "浏览完成，下单再得积分",
        ]
        // 等等机器人验证
        this.robotCheck();
        let duration = 0;
        while (duration < keepTime) {
            gesture(3000, [device.width / 2, device.height / 4 * 3], [device.width / 2, device.height / 4], [device.width / 2, device.height / 4 * 3]);
            // 完成的，提前跳出
            for(let i=0; i< finishTextArray.length; i++) {
                if (text(finishTextArray[i]).exists()) {
                    return;
                }
            };
            sleep(3000);
            duration += 3000;
        }
    },

    /**
     * 机器人验证提醒
     */
    robotCheck: function () {
        log("===== 机器人验证 START =====");
        // 等待滑动加载
        sleep(3000);
        // 尝试次数
        let retryTime = 1;
        // 如果需要验证，则提示
        while (text("向右滑动验证").exists() || text("亲，请拖动下方滑块完成验证").exists()) {
            if (retryTime > 2) {
                // 反馈
                let feedbacks = ["滑动验证码后提示验证失败", "频繁看到该验证码"];
                this.combinedClickText("点我反馈 >", 3000);
                this.combinedClickText(feedbacks[this.getRandomNumber(0, 1)], 1000);
                this.combinedClickText("提交", 5000);
                back();
                sleep(3000);
                break;
            }
            this.slidingVerification();
            retryTime++;
        }
        log("===== 机器人验证 END =====");
    },

    /**
     * 滑动验证
     */
    slidingVerification: function () {
        // 刷新滑块
        this.clickDIP("android.widget.TextView", 13, 0, 1000)
        log("===== 开始滑动 START =====");
        let slideBounds = className("android.widget.Button").text("滑块").exists() ? className("android.widget.Button").text("滑块").findOne().bounds() : className("android.widget.TextView").text("滑块").findOne().bounds();
        // 最左边X坐标
        let xLeft = slideBounds.centerX();
        let bounds = className("android.widget.TextView").text("向右滑动验证").findOne().bounds();
        let xRight = bounds.right;
        // 分割次数
        let cnt = 3;
        // 高度
        let height = slideBounds.bottom - slideBounds.top;
        // 长度
        let length = xRight - xLeft;
        // 坐标1
        let x1 = xLeft;
        let y1 = this.getRandomNumber(slideBounds.top + height / 4, slideBounds.bottom - height / 4);
        for (let i = 0; i < cnt - 1; i++) {
            // 坐标2
            let x2 = x1 + (length / cnt) + this.getRandomNumber(0, length / (cnt * (cnt - 1)))
            let y2 = this.getRandomNumber(slideBounds.top + height / 4, slideBounds.bottom - height / 4);
            // 滑动
            swipe(x1, y1, x2, y2, this.getRandomNumber(1000, 1500));
            x1 = x2;
            y1 = y2;
        }
        // 最终坐标
        swipe(x1, y1, xRight, this.getRandomNumber(slideBounds.top + height / 4, slideBounds.bottom - height / 4), this.getRandomNumber(700, 800));
        // 等待滑动成功后跳转
        sleep(3000);
        log("===== 开始滑动 END =====");
    }
}