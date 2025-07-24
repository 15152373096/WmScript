// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');
// 加载支付宝操作公共方法
let combo = require('../entrance/Combo.js');

// 入口
run();

function run() {
    let globalConfig = deviceService.getGlobalConfig()
    if (!globalConfig.globalSwitch) {
        log("======定时开关关闭，不执行任务======");
        return;
    }
    // 当前时间
    let now = new Date();
    let currentTime = deviceService.formatDate(now);

    if (deviceService.containsInArray(globalConfig.energyRainConfig.fixRunTime, currentTime.hourMinute)) {
        threads.start(function () {
            // 能量雨任务
            combo.forestEnergyJob();
        });
    } else if (deviceService.containsInArray(globalConfig.allSignConfig.fixRunTime, currentTime.hourMinute)) {
        threads.start(function () {
            // 一系列签到
            combo.allSignJob();
        });
    } else {
        // 睡觉时间免打扰
        if (deviceService.earlierThan(7, 11)) {
            return;
        }
        // 上次运行时间
        let lastRunTime = globalConfig.mainJobConfig.lastRunTime;
        // 任务间隔
        let timeInterval = globalConfig.mainJobConfig.timeInterval;
        // 获取时间差
        let timeDiff = deviceService.getTimeDifference(deviceService.stringToDate(lastRunTime), now);
        // combo任务
        if (timeInterval <= timeDiff.minutes) {
            log("======满足时间间隔，开始任务======");
            // 更新运行时间
            deviceService.updateLastRunTime();
            // combo执行
            threads.start(function () {
                combo.mainJob();
            });
        }
    }
}