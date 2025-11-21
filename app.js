
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
        contWheat: 0,
        money: 0,
        contSell: 0,
        contAutoClicker: 0,
        costoUpgrade: [10],
        costoArea: [500],
        moltiplicatoreUpgrade: [1.5],
        livelloUpgrade: [0],
        autoClickerCost: [100],
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
        this.$refs.primaryButton.style.pointerEvents = 'all';
      },
      clickType1() {
        const sellButton = this.$refs.sellButton1;
        sellButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        const button = this.$refs.primaryButton;
        animazioneBottone(button);
        this.contWheat = Math.round((this.contWheat + 1 + (0.1 * this.livelloUpgrade[0]) ) * 10) / 10;
        if(this.contWheat == 10) {
          const sellButton = this.$refs.sellButton1;
          sellButton.style.opacity = 1;
          sellButton.style.pointerEvents = 'all';
        }
      },
      sell() {
        if(this.contSell == 0) {
          const textCycle = this.$refs.textCycle1;
          textCycle.style.opacity = 1;
          const button = this.$refs.upgradeButton1;
          if(this.money >= this.costoUpgrade[0]) {
          const upgradeButton = this.$refs.upgradeButton1;
          upgradeButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        }
          button.style.opacity = 1;
          button.style.pointerEvents = 'all';
        }
        this.contSell++;
        moneyEarned = this.contWheat * 2;
        this.money += Math.round(moneyEarned * 10) / 10;
        this.contWheat = 0;
        const button = this.$refs.sellButton1;
        animazioneBottone(button);
        button.style.backgroundColor = '#03a909ff';
        if(this.money >= this.costoUpgrade[0]) {
          const upgradeButton = this.$refs.upgradeButton1;
          upgradeButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        }
        if(this.money > 100) {
          this.$refs.autoClicker1.style.backgroundColor = 'red';
        }
      },
      upgrade(num) {
        switch(num) {
          case 0:
            var button = this.$refs.upgradeButton1;
            break;
        }
        if(this.money >= this.costoUpgrade[num]) {
          animazioneBottone(button);
          this.money -= Math.round(this.costoUpgrade[num] * 10) / 10;
          this.money = Number(this.money.toFixed(1))
          this.livelloUpgrade[num]++;
          this.costoUpgrade[num] = Math.floor(this.costoUpgrade[num] * this.moltiplicatoreUpgrade[num]);
          if(this.money < this.costoUpgrade[num]) {
            button.style.backgroundColor = '#03a909ff';
          }
          if(this.livelloUpgrade[num] == 6) {
            const button = this.$refs.autoClicker1;
            button.style.opacity = 1;
            button.style.pointerEvents = 'all';
            if(this.money > 100) {
              button.style.backgroundColor = 'red';
          }
          else if(this.livelloUpgrade[num] == 7) {
            const button = this.$refs.unlockAreaButton;
            button.style.opacity = 1;
            button.style.pointerEvents = 'all';
          }
        }
        }
        
      },
      autoClicker(num) {
        switch(num) {
          case 0:
            if(this.money < autoClickerCost[num]) return;
            setInterval(() => {
              this.contWheat += this.contAutoClicker;
            }, 1000);
            break;
        }
        this.contAutoClicker++;
        this.money -= autoClickerCost[num];
        this.money = Number(this.money.toFixed(1));
        autoClickerCost[num] += 100;
    },
  }
});

app.mount('#app');
