let preloadScreen, gameScreen, btn, counter, kpcCounter;
let emptySave = {
    balance : 0, kpc : 1, kps : 0,
    upgrades : [
        {
            title : 'Отобрать охоту',
            cost : 100,
            clickBonus : 1,
            secondBonus : 0,
            multiplier : 1.7,
            canBuy : true,
            titleId : "up1-title",
            buttonId : "up1-buy"
        },
        {
            title : '"нахуй тебе шнурки"',
            cost : 500,
            clickBonus : 2,
            secondBonus : 0,
            multiplier : 1.9,
            canBuy : false,
            titleId : "up2-title",
            buttonId : "up2-buy"
        }
    ]
};
let save = loadSave() || emptySave;

function loadSave(){
    let s;
    try{
        s = JSON.parse(localStorage.getItem("kill_aboba"));
    }catch(e){}
    return s;
}

function writeSave(){
    localStorage.setItem("kill_aboba", JSON.stringify(save));
}

function setTab(tabName){
	document.querySelector('.tab.active').classList.remove('active');
	document.querySelector('.tab.'+tabName).classList.add('active');
}

function upgradeBuy(upgradeId){
    let upgrade = save.upgrades[upgradeId];
    let nextUp = save.upgrades[upgradeId + 1];

    if(!upgrade.canBuy || save.balance < upgrade.cost)
        return;

    save.balance -= upgrade.cost;
    save.kpc += upgrade.clickBonus;
    save.kps += upgrade.secondBonus;
    upgrade.cost *= upgrade.multiplier;

    

    if(nextUp && !nextUp.canBuy){
        nextUp.canBuy = true;
    }
}

function draw(){
    counter.innerText = save.balance;
    kpcCounter.innerText = save.kpc;

    for(let upgrade of save.upgrades){
        document.getElementById(upgrade.titleId).innerText = `${upgrade.title} (-${upgrade.cost};+${upgrade.clickBonus})`;
        if(upgrade.canBuy){
            document.getElementById(upgrade.buttonId).disabled = false;
        }
    }
}

function init(){
    preloadScreen = document.getElementById("preload");
    gameScreen = document.getElementById("game");
    btn = document.querySelector("#game button");
    counter = document.getElementById("counter");
    kpcCounter = document.getElementById("kpc");

    setInterval(() => {
        preloadScreen.style.animation = "fadeOut 0.3s ease-out";
        preloadScreen.style.opacity = "0";
        preloadScreen.style.display = "none";
        gameScreen.style.zIndex = 999;
    }, 1000);

    btn.onclick = () => {
        save.balance += save.kpc;
    }

    setInterval(() => writeSave(), 10000);
    setInterval(() => draw(), 100);

}

document.body.onload = init;