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
        // unlock 
        let xLeft = 250;
        let yBottom = 1785;
        let yMiddle = 1500;
        let yTop = 1215;
        if ("23013RK75C" == device.model) {
            xLeft = 365;
            yBottom = 2645;
            yMiddle = 2290;
            yTop = 1935;
        }
        gesture(1000, [xLeft, yBottom], [xLeft, yTop], [deviceWidth / 2, yMiddle], [deviceWidth - xLeft, yTop], [deviceWidth - xLeft, yBottom]);
        sleep(2000);
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
        lockScreen();
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
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].toString() != currentJob.toString()) {
                log("停止脚本", jobs[i].toString());
                jobs[i].forceStop();
            }
        }
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
        for (let textName of textNameArray) {
            this.combinedClickText(textName, sleepTime);
        }
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
     * 初始化任务列表
     * @param configTaskNameList
     */
    initTaskNameList: function (configTaskNameList) {
        let taskList = [];
        for (let i = 0; i < configTaskNameList.length; i++) {
            taskList.push(configTaskNameList[i]);
            for (let j = 1; j <= 5; j++) {
                for (let k = 0; k < j; k++) {
                    taskList.push(configTaskNameList[i] + "(" + k + "/" + j + ")")
                }
            }
        }
        return taskList;
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
     * 按照设备比例点击
     * @param {number} xRate
     * @param {number} yRate
     * @param {number} sleepTime
     */
    clickRate: function (xRate, yRate, sleepTime) {
        // 设备参数
        let deviceWidth = device.width;
        let deviceHeight = device.height;
        click(deviceWidth * xRate, deviceHeight * yRate);
        sleep(sleepTime);
    },

    /**
     * 判断图片是否存在
     * @param {String} lookupImage
     */
    imageExist: function (lookupImage) {
        let p = images.findImage(images.captureScreen(), lookupImage, {threshold: 0.9});
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
        let p = images.findImage(images.captureScreen(), lookupImage, {threshold: 0.9});
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return {
            formatDay: year + '-' + month + '-' + day,
            formatMinute: year + '-' + month + '-' + day + " " + hour + ":" + minute,
            formatSecond: year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second,
            hourMinute: hour + ":" + minute,
        };
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
    }
}