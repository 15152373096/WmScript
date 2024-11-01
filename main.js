"ui";
ui.layout(
    <frame>
        <vertical>
            <Switch w="360" h="40" margin="10" id="globalSwitch" text="脚本开关" checked="false" textSize="20sp"/>
            <horizontal>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="网商发发日" id="fafa"/>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="一系列签到" id="allSign"/>
            </horizontal>
            <horizontal>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="全员送道具" id="giveTool"/>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="庄园种小麦" id="plantWheat"/>
            </horizontal>
            <horizontal>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="月月赚任务" id="monthEarn"/>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="淘宝芭农场" id="taoBaoBaBa"/>
            </horizontal>
            <horizontal>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="拯救小鸡" id="rescueChicken"/>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="庄园星星球" id="ballJob"/>
            </horizontal>
            <horizontal>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="网商一零五" id="netBank"/>
                <button w="180" h="80" margin="10" textSize="20sp" bg="#90EE90" text="森林能量雨" id="energyRain"/>
            </horizontal>
            <horizontal>
                <button w="380" h="80" margin="10" textSize="20sp" bg="#90EE90" text="一整套连招" id="combo"/>
            </horizontal>
            <horizontal>
                <text w="140" textSize="20sp"  text="上次运行时间:"/>
                <text w="220" id="lastRunTime" text="上次运行时间" textSize="20sp"/>
            </horizontal>
        </vertical>
    </frame>
);

// 加载设备操作公共方法
let deviceService = require('src/service/DeviceService.js');
// 加载支付宝操作公共方法
let combo = require('src/entrance/Combo.js');
init()

/**
 * 初始化
 */
function init() {
    let globalConfig = deviceService.getGlobalConfig()
    ui.globalSwitch.checked = globalConfig.globalSwitch;
    ui.lastRunTime.text(globalConfig.mainJobConfig.lastRunTime);
}


//指定确定按钮点击时要执行的动作
ui.combo.click(function () {
    threads.start(function () {
        combo.mainJob();
    });
});
ui.ballJob.click(function () {
    threads.start(function () {
        combo.starBallJob();
    });
});
ui.energyRain.click(function () {
    threads.start(function () {
        combo.energyRainJob();
    });
});
ui.netBank.click(function () {
    threads.start(function () {
        combo.netBankJob();
    });
});
ui.fafa.click(function () {
    threads.start(function () {
        combo.fafaJob();
    });
});
ui.rescueChicken.click(function () {
    threads.start(function () {
        combo.rescueChicken();
    });
});
ui.monthEarn.click(function () {
    threads.start(function () {
        combo.monthEarnJob();
    });
});
ui.giveTool.click(function () {
    threads.start(function () {
        combo.giveToolJob();
    });
});
// ui.himalayanTime.click(function () {
//     threads.start(function () {
//         combo.himalayanTimeJob();
//     });
// });
ui.plantWheat.click(function () {
    threads.start(function () {
        combo.plantWheatJob();
    });
});
ui.allSign.click(function () {
    threads.start(function () {
        combo.allSignJob();
    });
});
ui.taoBaoBaBa.click(function () {
    threads.start(function () {
        combo.taoBaoBaBaJob();
    });
});

// 开关切换
ui.globalSwitch.on("check", function (checked) {
    deviceService.changeSwitch(checked);
});