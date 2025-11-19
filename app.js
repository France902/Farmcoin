
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


const app = createApp({
    data() {
      return {
        contWheat: 0,
        money: 0,
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
        document.getElementById("menuGioco").style.display = "none";
        document.getElementById("strutturaGioco").style.display = "block";
      },
      clickType1() {
        const sellButton = this.$refs.sellButton;
        sellButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        const button = this.$refs.primaryButton;
        button.style.transform = "translateY(3px) scale(0.97)";
        button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
        setTimeout(() => {
          button.style.transform = "translateY(0) scale(1)";
          button.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
        }, 80);
        this.contWheat++;
        if(this.contWheat == 10) {
          const sellButton = this.$refs.sellButton;
          sellButton.style.opacity = 1;
          sellButton.style.pointerEvents = 'all';
        }
      },
      sell() {
        moneyEarned = this.contWheat * 2;
        this.money += moneyEarned;
        this.contWheat = 0;
        const button = this.$refs.sellButton;
        button.style.transform = "translateY(3px) scale(0.97)";
        button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
        setTimeout(() => {
          button.style.transform = "translateY(0) scale(1)";
          button.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
        }, 80);
        sellButton.style.backgroundColor = '#03a909ff';
      }
    },
    
});

app.mount('#app');
