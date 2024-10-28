// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');

// 每次锁屏，确保开关打开
deviceService.changeSwitch(true);