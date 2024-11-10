// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');

// 解锁成功后，关闭定时任务
deviceService.changeSwitch(false);