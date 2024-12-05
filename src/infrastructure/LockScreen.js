// 加载设备操作公共方法
let deviceService = require('../service/DeviceService.js');

// 每次锁屏，确保开关打开
deviceService.changeSwitch(true);

// 停止所有正在运行的脚本
engines.stopAll();