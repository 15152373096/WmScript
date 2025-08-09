"ui";
ui.layout(
    <frame>
        <vertical>
            <Switch w="{{Math.floor(device.width*0.98)}}px" h="{{Math.floor(device.width*0.1)}}px" margin="{{Math.floor(device.width*0.01)}}px" id="globalSwitch" text="脚本开关" checked="false" textSize="20sp"/>
            <horizontal>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="积分补签到" id="makeUpSignIn"/>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="全员送道具" id="giveToolTask"/>
            </horizontal>
            <horizontal>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="庄园种小麦" id="plantWheatTask"/>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="家庭和运动" id="chickenFamilyAndSport"/>
            </horizontal>
            <horizontal>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="待定的功能" id="initAnswerTask"/>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="天天来签到" id="allSignTask"/>
            </horizontal>
            <horizontal>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="手环计步器" id="syncStepTask"/>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="淘芭芭农场" id="taoBaoBaBa"/>
            </horizontal>
            <horizontal>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="网商一零五" id="netBank"/>
                <button w="{{Math.floor(device.width*0.48)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="森林赚能量" id="forestEnergy"/>
            </horizontal>
            <horizontal>
                <button w="{{Math.floor(device.width*0.98)}}px" h="{{Math.floor(device.width*0.2)}}px" margin="{{Math.floor(device.width*0.01)}}px" textSize="20sp" bg="#90EE90" text="一整套连招" id="comboTask"/>
            </horizontal>
            <horizontal>
                <text w="{{Math.floor(device.width*0.36)}}px" text="上次运行时间:" textSize="20sp" margin="{{Math.floor(device.width*0.01)}}px"/>
                <text w="{{Math.floor(device.width*0.60)}}px" text="上次运行时间" textSize="20sp" margin="{{Math.floor(device.width*0.01)}}px" id="lastRunTime" />
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
ui.comboTask.click(function () {
    threads.start(function () {
        combo.mainJob();
    });
});
ui.forestEnergy.click(function () {
    threads.start(function () {
        combo.forestEnergyJob();
    });
});
ui.netBank.click(function () {
    threads.start(function () {
        combo.netBankJob();
    });
});
ui.makeUpSignIn.click(function () {
    threads.start(function () {
        combo.makeUpSignInJob();
    });
});
ui.chickenFamilyAndSport.click(function () {
    threads.start(function () {
        combo.chickenFamilyAndSportJob();
    });
});
ui.syncStepTask.click(function () {
    threads.start(function () {
        combo.syncStepJob();
    });
});
ui.giveToolTask.click(function () {
    threads.start(function () {
        combo.giveToolJob();
    });
});
ui.plantWheatTask.click(function () {
    threads.start(function () {
        combo.plantWheatJob();
    });
});
ui.initAnswerTask.click(function () {
    threads.start(function () {

    });
});
ui.allSignTask.click(function () {
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