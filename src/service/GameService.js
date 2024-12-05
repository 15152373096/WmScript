// 加载设备操作公共方法
let deviceService = require('./DeviceService.js');

module.exports = {
    /**
     * 沙威玛
     */
    shaWeiMa: function () {

        for (let i = 0; i < 12; i++) {
            for (let j = 0; j <10; j++) {
                for (let k = 0; k < 2; k++) {
                    // 材料1
                    click(850, 980);sleep(200);
                    // 材料2
                    click(1120, 980);sleep(200);
                    // 材料3
                    click(1390, 980);sleep(200);
                    // 材料4
                    click(1680, 980);sleep(200);
                    // 橙汁
                    click(2375, 755);sleep(200);
                    // 可乐
                    click(2500, 755);sleep(200);
                }
                sleep(1000);
            }
            // 工人
            click(380, 620);sleep(200);
        }
    }
}