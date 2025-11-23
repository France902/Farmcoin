
const { createApp } = Vue;

function drawMap() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const scaleFactor = 4;
    canvas.width = window.innerWidth * scaleFactor;
    canvas.height = window.innerHeight * scaleFactor;


    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    function vw(v) { return window.innerWidth * (v / 100); }
    function vh(v) { return window.innerHeight * (v / 100); }

    let imgX = 200;   
    let imgY = 50;   
    let imgW = 100;    
    let imgH = 100;    
    let cols = 4;     
    let rows = 4;    

    const sources = [
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
      "giardino.jpg",
    ];

    let images = [];
    let loadedCount = 0;

    sources.forEach((src, i) => {
    const img = new Image();
    img.onload = () => {
        loadedCount++;
        if (loadedCount === sources.length) drawImages(); 
    };
    img.src = src;
    images.push(img);
    });

    function drawImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalWidth = vw(imgW * cols);
    const startX = vw(imgX) - totalWidth / 2;

    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
        const index = i * cols + j;
        if (!images[index]) continue;

        ctx.drawImage(
            images[index],
            startX + vw(j * imgW),
            vh(imgY - imgH / 2 + i * imgH),
            vw(imgW),
            vh(imgH)
        );
        }
    }
    }

    window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImages();
    });

}

drawMap();

function animazioneBottone(button) {
    button.style.transform = "translateY(3px) scale(0.97)";
    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    setTimeout(() => {
      button.style.transform = "translateY(0) scale(1)";
      button.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
    }, 80);
  }

const app = createApp({
    data() {
      return {
        contMais: 0,
        contCarrot: 0,
        money: 0,
        contSell: [0, 0],
        contAutoClicker: [0, 0],
        costoUpgrade: [10, 150],
        costoArea: [200],
        moltiplicatoreUpgrade: [1.5, 1.7],
        livelloUpgrade: [0, 0],
        autoClickerCost: [100, 220],
        clickButtons: [],
        sellButtons: [],
        upgradeButtons: [],
        autoClickers: [],
        textCycle: [],
      }
    },
    

    methods: {
      onHoverStart(tipo='start') {
        let button;
        if(tipo == 'impostazioni') {
          button = this.$refs.btnSetting;
        }
        else {
          button = this.$refs.btnStart;
        }
        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = 'lightgreen';
        button.style.boxShadow = '0 4px rgba(0,100,0,0.6)';
      },
      onLeaveStart(tipo='start') {
        let button;
        if(tipo == 'impostazioni') {
          button = this.$refs.btnSetting;
        }
        else {
          button = this.$refs.btnStart;
        }
        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = '#4CAF50';
        button.style.boxShadow = '0 4px green';
      },
      startGame() {
        this.$refs.overlayMap.style.opacity = '0';
        document.getElementById("menuGioco").style.display = "none";
        document.getElementById("strutturaGioco").style.display = "block";
        for(let i = 0; i < this.clickButtons.length; i++) {
          this.clickButtons[i].style.pointerEvents = 'all';
        }
      },
      click(num) {
        const sellButton = this.sellButtons[num];
        sellButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        const button = this.clickButtons[num];
        animazioneBottone(button);
        switch(num) {
          case 0:
            this.contMais = Math.round((this.contMais + 1 + (0.1 * this.livelloUpgrade[0]) ) * 10) / 10;
            break;
          case 1:
            this.contCarrot = Math.round((this.contCarrot + 1 + (0.2 * this.livelloUpgrade[1]) ) * 10) / 10;
            break;
        }
        if(this.contMais == 10 || this.contCarrot == 10) {
          sellButton.style.opacity = '1';
          sellButton.style.pointerEvents = 'all';
        }
      },
      sell(num) {
        let moneyEarned = 0;
        switch(num) {
          case 0:
            moneyEarned = this.contMais * 2;
            this.contMais = 0;
            break;
          case 1:
            moneyEarned = this.contCarrot * 3;
            this.contCarrot = 0;
            break;
        }
        this.money += Math.round(moneyEarned * 10) / 10;
        this.money = Number(this.money.toFixed(1));
        const button = this.sellButtons[num];
        animazioneBottone(button);
        button.style.backgroundColor = '#03a909ff';
        if(this.money >= this.costoUpgrade[num]) {
          const button = this.upgradeButtons[num];
          button.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        }
        if(this.livelloUpgrade[0] >= 6) {
          if(this.money > 100) {
            this.autoClickers[0].style.backgroundColor = 'red';
          } else this.autoClickers[0].style.backgroundColor = 'rgb(166, 2, 2)';
        } else if(this.livelloUpgrade[1] >= 3) {
          if(this.money > 220) {
            this.autoClickers[1].style.backgroundColor = 'red';
          } else this.autoClickers[1].style.backgroundColor = 'rgb(166, 2, 2)';
        }
        if(this.contSell[num] == 0) {
          const button = this.upgradeButtons[num];
          const text = this.textCycle[num];
          text.style.opacity = '1';
          button.style.opacity = '1';
          button.style.pointerEvents = 'all';
        }
        this.contSell[num]++;
      },
      upgrade(num) {
        const button = this.upgradeButtons[num];
        if(this.money >= this.costoUpgrade[num]) {
          animazioneBottone(button);
          this.money -= Math.round(this.costoUpgrade[num] * 10) / 10;
          this.money = Number(this.money.toFixed(1));
          this.livelloUpgrade[num]++;
          this.costoUpgrade[num] = Math.floor(this.costoUpgrade[num] * this.moltiplicatoreUpgrade[num]);
          if(this.money < this.costoUpgrade[num]) {
            button.style.backgroundColor = '#03a909ff';
          }
          if(num == 1 && this.livelloUpgrade[num] == 2) {
            const button = this.autoClickers[num];
            button.style.opacity = '1';
            button.style.pointerEvents = 'all';
              if(this.money > 100) {
                button.style.backgroundColor = 'red';
            }
          }
          if(this.livelloUpgrade[num] == 6) {
            const button = this.autoClickers[num];
            button.style.opacity = '1';
            button.style.pointerEvents = 'all';
            if(this.money > 100) {
              button.style.backgroundColor = 'red';
          }
        }
        else if(this.livelloUpgrade[num] == 7) {
            const button = this.$refs.unlockAreaButton;
            button.style.opacity = '1';
            button.style.pointerEvents = 'all';
          }
        }
        
      },
    autoClicker(num) {  
        if(this.money < this.autoClickerCost[num]) return;
        
        this.contAutoClicker[num]++;
        if(this.contAutoClicker[num] == 1) {
          setInterval(() => {
            if(num == 0) this.contMais += this.contAutoClicker[0];
            else if(num == 1) this.contCarrot += this.contAutoClicker[1];
            this.sellButtons[num].style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
          }, 1000);
        }
        this.money -= this.autoClickerCost[num];
        this.money = Number(this.money.toFixed(1));
        this.autoClickerCost[num] += this.autoClickerCost[num];
        if(this.money < this.autoClickerCost[num]) {
          this.autoClickers[num].style.backgroundColor = 'rgb(166, 2, 2)';
        }
        if(this.money < this.costoUpgrade[num]) {
          this.upgradeButtons[num].style.backgroundColor = '#03a909ff';
        }
    },
    unlockArea(num) {
      switch(num) {
        case 1:
          if(this.money < this.costoArea[num - 1]) return;
          this.money -= this.costoArea[num - 1];
          this.money = Number(this.money.toFixed(1));
          const button = this.$refs.unlockAreaButton;
          button.style.display = 'none';
          const secondArea = this.$refs.secondArea;
          secondArea.style.display = 'block';
          break;
      }
    }
  }
});

app.mount('#app');
