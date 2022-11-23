let preloadScreen, gameScreen, btn, counter, kpcCounter,
    lastSaveTimeText, notifications, kickTimes, upgradesCount, kpsCounter,
    arenaImg, abobaHPSpan, abobaHPProgress;
let emptySave = {
    balance : 0, kpc : 1, kps : 0,
    kickTimes : 0,
    upgrades : [
        {
            title : 'Отобрать охоту',
            cost : 100,
            clickBonus : 1,
            secondBonus : 0,
            multiplier : 1.7,
            titleId : "up1-title",
            buttonId : "up1-buy",
            value : 0
        },
        {
            title : 'нанять артёмку',
            cost : 250,
            clickBonus : 0,
            secondBonus : 1,
            multiplier : 1.5,
            titleId : "up2-title",
            buttonId : "up2-buy",
            value : 0
        },
        {
            title : '"нахуй тебе шнурки"',
            cost : 500,
            clickBonus : 3,
            secondBonus : 0,
            multiplier : 1.9,
            titleId : "up3-title",
            buttonId : "up3-buy",
            value : 0
        }
    ],
    arena : {
        skin : 'aboba',
        hp : 100,
        maxhp : 100
    },
    last_save_time : new Date(Date.now()),
    version : '0.0.2'
};
let actualVersion = '0.0.2';
let save = loadSave() || emptySave;

function deleteSave(){
    save = emptySave;
    writeSave();
    createNotification("Сохранение удалено", "red");
}

function importSave(){
    alert(JSON.stringify(save));
}

function exportSave(){
    save = prompt("Enter save string");
}

function loadSave(){
    let s;
    try{
        s = JSON.parse(localStorage.getItem("kill_aboba"));
        s.last_save_time = new Date(s.last_save_time);
    }catch(e){}
    return s;
}

function writeSave(){
    save.last_save_time = new Date(Date.now()).toString();
    localStorage.setItem("kill_aboba", JSON.stringify(save));
    save.last_save_time = new Date(save.last_save_time);
    createNotification("Сохранение...", "green");
}

function setTab(tabName){
	document.querySelector('.tab.active').classList.remove('active');
	document.querySelector('.tab.'+tabName).classList.add('active');
}

function upgradeBuy(upgradeId){
    let upgrade = save.upgrades[upgradeId];
    let canBuy = upgradeId == 0 ? true : (save.upgrades[upgradeId - 1].value > 0 ? true : false);

    if(!canBuy || save.balance < upgrade.cost)
        return;

    save.balance -= upgrade.cost;
    save.kpc += upgrade.clickBonus;
    save.kps += upgrade.secondBonus;
    upgrade.cost *= upgrade.multiplier;
    upgrade.value += 1;
}

function draw(){
    counter.innerText = save.balance.toFixed(2);
    kpcCounter.innerText = save.kpc;
    lastSaveTimeText.innerText = save.last_save_time.toLocaleString('ru');
    kickTimes.innerText = save.kickTimes;
    upgradesCount.innerText = save.upgrades.reduce((count, up) => count += up.value, 0);
    kpsCounter.innerText = save.kps;
    abobaHPSpan.innerText = `${save.arena.hp.toFixed(0)}/${save.arena.maxhp.toFixed(0)}`;
    abobaHPProgress.value = save.arena.hp;

    for(let i = 0; i < save.upgrades.length; i++){
        let upgrade = save.upgrades[i];
        let nextUpgrade = save.upgrades[i + 1] || false;

        document.getElementById(upgrade.titleId).innerText = `${upgrade.title} (-${upgrade.cost.toFixed(0)};+${upgrade.clickBonus} +${upgrade.secondBonus}/c)`;

        if(!nextUpgrade) continue;

        if(upgrade.value < 1){
            document.getElementById(nextUpgrade.buttonId).disabled = true;
        }else document.getElementById(nextUpgrade.buttonId).disabled = false;
    }

    save.arena.hp -= save.kps / 10;
}

function init(){
    preloadScreen = document.getElementById("preload");
    gameScreen = document.getElementById("game");
    btn = document.querySelector("#game button");
    counter = document.getElementById("counter");
    kpcCounter = document.getElementById("kpc");
    lastSaveTimeText = document.getElementById("last-save-time");
    notifications = document.getElementsByClassName("notifications")[0];
    kickTimes = document.getElementById('kickTimes');
    upgradesCount = document.getElementById('upgradesCount');
    kpsCounter = document.getElementById('kps');
    document.getElementById('version').innerText = 'v' + save.version;
    arenaImg = document.querySelector('.arena-wrapper>img');
    abobaHPSpan = document.getElementById('abobaHP');
    abobaHPProgress = document.getElementById('abobaHPProgress');

    setTimeout(() => {
        preloadScreen.style.animation = "fadeOut 0.3s ease-out";
        preloadScreen.style.opacity = "0";
        preloadScreen.style.display = "none";
        gameScreen.style.zIndex = 999;
        arenaImg.onclick = () => {
            if(save.arena.hp - save.kpc <= 0){
                save.arena.hp = save.arena.maxhp;
                save.balance += 100 + (100 * Math.random());
            }
            save.arena.hp -= save.kpc;
            save.kickTimes += 1;
        }
        if(save.version != actualVersion){
            alert('Ваше сохранение создано на старой версии игры, пожалуйста удалите его');
        }
        setInterval(() => writeSave(), 10000);
        setInterval(() => draw(), 100);
    }, 1000);
}

function createNotification(text, color){
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.backgroundColor = color;
    notification.innerText = text;
    notifications.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut .3s ease-out';
        setTimeout(() => {
            notification.style.opacity = 0;
            notification.style.display = "none";
            notification.remove();
        }, 300);
    }, 2500);
}

document.body.onload = init;