const { createApp } = Vue;

// Funzione principale che inizializza il canvas e gestisce il rendering della mappa
function drawMap() {
    // Recupera il canvas e il contesto grafico 2D
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Imposta un fattore di scala per aumentare la qualità dell'immagine
    // (utile per schermi ad alta densità di pixel)
    const scaleFactor = 4;
    canvas.width = window.innerWidth * scaleFactor;
    canvas.height = window.innerHeight * scaleFactor;

    // Ridimensiona visivamente il canvas alle dimensioni della viewport
    // senza alterarne la risoluzione interna
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    // Funzioni di utilità per convertire valori percentuali in pixel
    function vw(v) { return window.innerWidth * (v / 100); }
    function vh(v) { return window.innerHeight * (v / 100); }

    // Configurazioni posizione/dimensioni immagini e griglia
    let imgX = 200;     
    let imgY = 50;      
    let imgW = 100;     
    let imgH = 100;     
    let cols = 4;       
    let rows = 4;       

    // Array di sorgenti immagine da caricare
    const sources = [
      "giardino.jpg", "giardino.jpg", "giardino.jpg", "giardino.jpg",
      "giardino.jpg", "giardino.jpg", "giardino.jpg", "giardino.jpg",
      "giardino.jpg", "giardino.jpg", "giardino.jpg", "giardino.jpg",
      "giardino.jpg", "giardino.jpg", "giardino.jpg", "giardino.jpg",
    ];

    let images = [];         // Contiene oggetti Image caricati
    let loadedCount = 0;     // Contatore immagini caricate

    // Caricamento asincrono delle immagini
    sources.forEach((src, i) => {
        const img = new Image();

        // Quando un'immagine è caricata aggiorna il contatore
        img.onload = () => {
            loadedCount++;

            // Quando tutte le immagini sono caricate, esegue il rendering
            if (loadedCount === sources.length) drawImages();
        };

        img.src = src;
        images.push(img);
    });

    // Funzione di rendering delle immagini nel canvas
    function drawImages() {
        // Pulisce completamente il canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calcola la larghezza totale della griglia per centrarla
        const totalWidth = vw(imgW * cols);
        const startX = vw(imgX) - totalWidth / 2;

        // Disegna la griglia immagine per immagine
        for (let j = 0; j < cols; j++) {
            for (let i = 0; i < rows; i++) {

                const index = i * cols + j;
                if (!images[index]) continue;

                ctx.drawImage(
                    images[index],
                    startX + vw(j * imgW),                    // Posizione X calcolata
                    vh(imgY - imgH / 2 + i * imgH),           // Posizione Y calcolata
                    vw(imgW),                                 // Larghezza immagine
                    vh(imgH)                                  // Altezza immagine
                );
            }
        }
    }

    // Re-render dinamico in caso di resize della finestra
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawImages();
    });
}

drawMap();


// Animazione clic di un bottone (effetto schiacciamento + ombra)
function animazioneBottone(button) {
  const offsetSmall = '0.4vh';
  const blurSmall = '0.8vh';
  const offsetLarge = '1vh';
  const blurLarge = '2vh';

  button.style.transform = `translateY(${offsetSmall}) scale(0.97)`;
  button.style.boxShadow = `0 ${offsetSmall} ${blurSmall} rgba(0, 0, 0, 0.2)`;

  setTimeout(() => {
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = `0 ${offsetLarge} ${blurLarge} rgba(0, 0, 0, 0.3)`;
  }, 80);
}



// ---- APP VUE ----

const app = createApp({
    data() {
      return {

        // Contatori delle risorse ottenute manualmente o tramite auto-clicker
        contMais: 0,
        contCarrot: 0,
        contTomatoes: 0,
        contPotatoes: 0,

        // Quantità totale di denaro del giocatore
        money: 0,

        // Numero di volte che ogni risorsa è stata cliccata
        contClick: [0, 0, 0, 0],

        // Numero di volte che ogni risorsa è stata venduta
        contSell: [0, 0, 0, 0],

        // Numero di auto-clicker attivi per ogni risorsa
        contAutoClicker: [0, 0, 0, 0],

        // Costo dell’upgrade di ciascuna risorsa
        costoUpgrade: [10, 100, 400, 1100],

        // Costo per sbloccare nuove aree di gioco
        costoArea: [200, 600, 3000],

        // Fattore di moltiplicazione applicato al costo upgrade dopo ogni acquisto
        moltiplicatoreUpgrade: [1.4, 1.4, 1.4, 1.4],

        // Livello dell’upgrade di ciascuna risorsa
        livelloUpgrade: [0, 0, 0, 0],

        // Costo iniziale di ogni auto-clicker
        autoClickerCost: [100, 150, 400, 800],

        // Array che conterranno i riferimenti ai pulsanti del gioco
        clickButtons: [],
        sellButtons: [],
        upgradeButtons: [],
        unlockAreaButtons: [],
        autoClickers: [],
        textCycle: [],
        counterButtons: [],
        tilemaps: [],
        mais: [],
        carrot: [],
        tomatoes: [],
        potatoes: []
      }
    },

    methods: {

      // Effetto hover sui pulsanti del menù
      onHoverStart(tipo='start') {
        let button;

        // Individua il pulsante corretto in base al tipo
        if(tipo == 'impostazioni') button = this.$refs.btnSetting;
        else if(tipo == 'restart') button = this.$refs.btnRestart;
        else if(tipo == 'continue') button = this.$refs.btnContinue;
        else button = this.$refs.btnStart;

        // Applica effetti grafici all’hover
        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = 'lightgreen';
        button.style.boxShadow = '0 0.3vw rgba(0,100,0,0.6)';
      },

      // Effetto quando l’hover termina
      onLeaveStart(tipo='start') {
        let button;

        if(tipo == 'impostazioni') button = this.$refs.btnSetting;
        else if(tipo == 'restart') button = this.$refs.btnRestart;
        else if(tipo == 'continue') button = this.$refs.btnContinue;
        else button = this.$refs.btnStart;

        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = '#4CAF50';
        button.style.boxShadow = '0 0.3vw green';
      },

      // Avvia la partita: nasconde il menu e abilita i pulsanti
      startGame() {
        this.tilemaps[0].style.opacity = '1';
        this.$refs.overlayMap.style.opacity = '0';
        document.getElementById("menuGioco").style.display = "none";
        document.getElementById("strutturaGioco").style.display = "block";

        // Rende cliccabili i pulsanti
        for(let i = 0; i < this.clickButtons.length; i++) {
          this.clickButtons[i].style.pointerEvents = 'all';
        }
      },

      // Riavvia completamente la pagina
      restartGame() {
        location.reload();
      },

      // Chiude la schermata di vittoria e torna al gioco
      continueGame() {
        this.$refs.victoryScreen.style.display = 'none';
      },

      // Logica del click per raccogliere risorse
      click(num, quanti = 1) {
        const sellButton = this.sellButtons[num];
        sellButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        const button = this.clickButtons[num];

        // Animazione visiva del pulsante
        animazioneBottone(button);

        // Aumento risorsa in base al tipo e agli upgrade
        switch(num) {
          case 0:
            this.contMais = Math.round((this.contMais + quanti + (0.1 * this.livelloUpgrade[0])) * 10) / 10;
            break;
          case 1:
            this.contCarrot = Math.round((this.contCarrot + quanti + (0.2 * this.livelloUpgrade[1])) * 10) / 10;
            break;
          case 2:
            this.contTomatoes = Math.round((this.contTomatoes + quanti + (0.3 * this.livelloUpgrade[2])) * 10) / 10;
            break;
          case 3:
            this.contPotatoes = Math.round((this.contPotatoes + quanti + (0.4 * this.livelloUpgrade[3])) * 10) / 10;
            break;
        }

        // Se la risorsa raggiunge almeno 10 unità, abilita il pulsante di vendita
        switch(num) {
          case 0:
            if(this.contMais >= 10) {
              sellButton.style.opacity = '1';
              sellButton.style.pointerEvents = 'all';
            }
            break;
          case 1:
            if(this.contCarrot >= 10) {
              sellButton.style.opacity = '1';
              sellButton.style.pointerEvents = 'all';
            }
            break;
          case 2:
            if(this.contTomatoes >= 10) {
              sellButton.style.opacity = '1';
              sellButton.style.pointerEvents = 'all';
            }
            break;
          case 3:
            if(this.contPotatoes >= 10) {
              sellButton.style.opacity = '1';
              sellButton.style.pointerEvents = 'all';
            }
            break;
        }
        if(this.contClick[num] == 0) {
          this.counterButtons[num].style.opacity = '1';
        }
        this.contClick[num]++;
        if(this.contClick[num] % 5 == 0) {
          const img = document.createElement('img');
          img.id = 'coltura';
          switch(num) {
            case 0:
              var leftStr = 4;
              var topStr = 82;
              img.src = 'mais.png';
              if(this.mais.length >= 30) return;
              if(this.mais.length % 10 == 0) {
                img.style.left = leftStr + 'vw';
              } else {
                img.style.left = leftStr + ((this.mais.length) - Math.trunc(this.mais.length / 10) * 10) * 2 + 'vw';
              }
              img.style.bottom = topStr - (Math.trunc(this.mais.length / 10) * 4) + 'vh';
              this.mais.push(img);
              break;
            case 1:
              var leftStr = 4;
              var topStr = 35;
              img.src = 'carrot.png';
              if(this.carrot.length >= 30) return;
              if(this.carrot.length % 10 == 0) {
                img.style.left = leftStr + 'vw';
              } else {
                img.style.left = leftStr + ((this.carrot.length) - Math.trunc(this.carrot.length / 10) * 10) * 2 + 'vw';
              }
              img.style.bottom = topStr - (Math.trunc(this.carrot.length / 10) * 4) + 'vh';
              this.carrot.push(img);
              break;
            case 2:
              var leftStr = 96;
              var topStr = 82;
              img.src = 'tomatoes.png';
              if(this.tomatoes.length >= 30) return;
              if(this.tomatoes.length % 10 == 0) {
                img.style.left = leftStr + 'vw';
              } else {
                img.style.left = leftStr - ((this.tomatoes.length) - Math.trunc(this.tomatoes.length / 10) * 10) * 2 + 'vw';
              }
              img.style.bottom = topStr - (Math.trunc(this.tomatoes.length / 10) * 4) + 'vh';
              this.tomatoes.push(img);
              break;
            case 3:
              var leftStr = 96;
              var topStr = 35;
              img.src = 'potatoes.png';
              if(this.potatoes.length >= 30) return;
              if(this.potatoes.length % 10 == 0) {
                img.style.left = leftStr + 'vw';
              } else {
                img.style.left = leftStr - ((this.potatoes.length) - Math.trunc(this.potatoes.length / 10) * 10) * 2 + 'vw';
              }
              img.style.bottom = topStr - (Math.trunc(this.potatoes.length / 10) * 4) + 'vh';
              this.potatoes.push(img);
              break;
          }
            
          document.body.appendChild(img);

          setTimeout(() => {
            img.style.opacity = '1';
          }, 1);
          
        }
      },
      // Logica della vendita risorse
      sell(num) {
        let moneyEarned = 0;

        // Calcola introito e azzera la risorsa
        switch(num) {
          case 0:
            moneyEarned = this.contMais * 2;
            this.contMais = 0;
            for(let i=0;i<this.mais.length;i++) {
              const el = this.mais[i];
              if (el) {
                if (typeof el.remove === 'function') el.remove();
                else if (el.parentNode) el.parentNode.removeChild(el);
              }
              this.mais.splice(i, 1);
              i--;
            }
            break;
          case 1:
            moneyEarned = this.contCarrot * 3;
            this.contCarrot = 0;
            for(let i=0;i<this.carrot.length;i++) {
              const el = this.carrot[i];
              if (el) {
                if (typeof el.remove === 'function') el.remove();
                else if (el.parentNode) el.parentNode.removeChild(el);
              }
              this.carrot.splice(i, 1);
              i--;
            }
            break;
          case 2:
            moneyEarned = this.contTomatoes * 5;
            this.contTomatoes = 0;
            for(let i=0;i<this.tomatoes.length;i++) {
              const el = this.tomatoes[i];
              if (el) {
                if (typeof el.remove === 'function') el.remove();
                else if (el.parentNode) el.parentNode.removeChild(el);
              }
              this.tomatoes.splice(i, 1);
              i--;
            }
            break;
          case 3:
            moneyEarned = this.contPotatoes * 8;
            this.contPotatoes = 0;
            for(let i=0;i<this.potatoes.length;i++) {
              const el = this.potatoes[i];
              if (el) {
                if (typeof el.remove === 'function') el.remove();
                else if (el.parentNode) el.parentNode.removeChild(el);
              }
              this.potatoes.splice(i, 1);
              i--;
            }
            break;
        }

        // Aggiunge denaro con arrotondamento a 1 decimale
        this.money += Math.round(moneyEarned * 10) / 10;
        this.money = Number(this.money.toFixed(1));

        const button = this.sellButtons[num];
        animazioneBottone(button);
        button.style.backgroundColor = '#03a909ff';

        // Se il giocatore può comprare un upgrade, evidenzia il pulsante
        for(let i=0;i<this.costoUpgrade.length;i++) {
          if(this.money >= this.costoUpgrade[i]) {
            this.upgradeButtons[i].style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
          }
        }
        

        // Sblocco auto-clicker in base ai livelli raggiunti
        switch (num) {
          case 0:
            if (this.livelloUpgrade[0] >= 6) {
              this.autoClickers[0].style.backgroundColor =
                (this.money > 100) ? 'red' : 'rgb(166, 2, 2)';
            }
            break;
          case 1:
            if (this.livelloUpgrade[1] >= 3) {
              this.autoClickers[1].style.backgroundColor =
                (this.money > this.autoClickerCost[num]) ? 'red' : 'rgb(166, 2, 2)';
            }
            break;
          case 2:
            if (this.livelloUpgrade[2] >= 4) {
              this.autoClickers[2].style.backgroundColor =
                (this.money > this.autoClickerCost[num]) ? 'red' : 'rgb(166, 2, 2)';
            }
            break;
          case 3:
            if (this.livelloUpgrade[3] >= 5) {
              this.autoClickers[3].style.backgroundColor =
                (this.money > this.autoClickerCost[num]) ? 'red' : 'rgb(166, 2, 2)';
            }
            break;
        }

        // Prima vendita: sblocca upgrade
        if(this.contSell[num] == 0) {
          const button = this.upgradeButtons[num];
          const text = this.textCycle[num];
          text.style.opacity = '1';
          button.style.opacity = '1';
          button.style.pointerEvents = 'all';
        }

        this.contSell[num]++;
      },

      // Upgrade delle risorse
      upgrade(num) {
        const button = this.upgradeButtons[num];

        if(this.money >= this.costoUpgrade[num]) {

          // Animazione e pagamento
          animazioneBottone(button);
          this.money -= Math.round(this.costoUpgrade[num] * 10) / 10;
          this.money = Number(this.money.toFixed(1));

          // Incrementa livello e aggiorna costo
          this.livelloUpgrade[num]++;
          this.costoUpgrade[num] =
            Math.floor(this.costoUpgrade[num] * this.moltiplicatoreUpgrade[num]);

          // Se ora non è più acquistabile, torna verde chiaro
          for(let i=0;i<this.costoUpgrade.length;i++) {
            if(this.money < this.costoUpgrade[i]) {
              this.upgradeButtons[i].style.backgroundColor = '#03a909ff';
            }
            if(this.money < this.autoClickerCost[i]) {
              this.autoClickers[i].style.backgroundColor = 'rgb(166, 2, 2)';
            }
          }
          

          // Sblocchi dinamici basati sui livelli raggiunti
          switch (num) {

            case 0:
              switch (this.livelloUpgrade[num]) {
                case 6:
                  this.autoClickers[num].style.opacity = '1';
                  this.autoClickers[num].style.pointerEvents = 'all';
                  if (this.money > this.autoClickerCost[num]) {
                    this.autoClickers[num].style.backgroundColor = 'red';
                  }
                  break;

                case 7:
                  this.unlockAreaButtons[num].style.opacity = '1';
                  this.unlockAreaButtons[num].style.pointerEvents = 'all';
                  break;
              }
              break;

            case 1:
              switch (this.livelloUpgrade[num]) {
                case 2:
                  this.autoClickers[num].style.opacity = '1';
                  this.autoClickers[num].style.pointerEvents = 'all';
                  break;

                case 6:
                  this.unlockAreaButtons[num].style.opacity = '1';
                  this.unlockAreaButtons[num].style.pointerEvents = 'all';
                  break;
              }
              break;

            case 2:
              switch (this.livelloUpgrade[num]) {
                case 4:
                  this.autoClickers[num].style.opacity = '1';
                  this.autoClickers[num].style.pointerEvents = 'all';
                  break;

                case 7:
                  this.unlockAreaButtons[num].style.opacity = '1';
                  this.unlockAreaButtons[num].style.pointerEvents = 'all';
                  break;
              }
              break;

            case 3:
              switch (this.livelloUpgrade[num]) {
                case 5:
                  this.autoClickers[num].style.opacity = '1';
                  this.autoClickers[num].style.pointerEvents = 'all';
                  break;
              }
              break;
          }

          // Controllo vittoria: tutti gli upgrade al livello 9
          for(let i=0;i<this.livelloUpgrade.length;i++) {
            if(this.livelloUpgrade[i] < 9) return;
          }

          this.vittoria();
        }
      },

      // Acquisto auto-clicker
      autoClicker(num) {
        const button = this.autoClickers[num];
        animazioneBottone(button);
        if(this.money < this.autoClickerCost[num]) return;

        this.contAutoClicker[num]++;

        // Se è il primo auto-clicker, attiva un timer che genera risorse automaticamente
        if(this.contAutoClicker[num] == 1) {
          setInterval(() => {
            this.click(num, this.contAutoClicker[num]);
            // Colora il pulsante di vendita per indicare disponibilità
            this.sellButtons[num].style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
          }, 1000);
        }

        // Pagamento e raddoppio del costo del prossimo auto-clicker
        this.money -= this.autoClickerCost[num];
        this.money = Number(this.money.toFixed(1));
        this.autoClickerCost[num] += this.autoClickerCost[num] / this.contAutoClicker[num];

        // Aggiornamenti visuali dei pulsanti
        for(let i=0;i<this.autoClickerCost.length;i++) {
          if(this.money < this.autoClickerCost[i]) {
            this.autoClickers[i].style.backgroundColor = 'rgb(166, 2, 2)';
          }
          if(this.money < this.costoUpgrade[i]) {
            this.upgradeButtons[i].style.backgroundColor = '#03a909ff';
          }
        }
        
        
      },

      // Sblocco di nuove aree di gioco
      unlockArea(num) {
        const button = this.unlockAreaButtons[num - 1];
        animazioneBottone(button);
        switch(num) {

          case 1:
            if(this.money < this.costoArea[num - 1]) return;
            this.money -= this.costoArea[num - 1];
            this.money = Number(this.money.toFixed(1));

            for(let i=0;i<this.costoUpgrade.length;i++) {
              if(this.money < this.costoUpgrade[i]) {
                this.upgradeButtons[i].style.backgroundColor = '#03a909ff';
              }
              if(this.money < this.autoClickerCost[i]) {
                this.autoClickers[i].style.backgroundColor = 'rgb(166, 2, 2)';
              }
            }
            // Nasconde il pulsante e mostra nuova area
            this.unlockAreaButtons[num-1].style.display = 'none';
            this.$refs.secondArea.style.display = 'block';
            break;

          case 2:
            if(this.money < this.costoArea[num - 1]) return;
            this.money -= this.costoArea[num - 1];
            this.money = Number(this.money.toFixed(1));

            for(let i=0;i<this.costoUpgrade.length;i++) {
              if(this.money < this.costoUpgrade[i]) {
                this.upgradeButtons[i].style.backgroundColor = '#03a909ff';
              }
              if(this.money < this.autoClickerCost[i]) {
                this.autoClickers[i].style.backgroundColor = 'rgb(166, 2, 2)';
              }
            }

            this.unlockAreaButtons[num-1].style.display = 'none';
            this.$refs.thirdArea.style.display = 'block';
            break;

          case 3:
            if(this.money < this.costoArea[num - 1]) return;
            this.money -= this.costoArea[num - 1];
            this.money = Number(this.money.toFixed(1));

            for(let i=0;i<this.costoUpgrade.length;i++) {
              if(this.money < this.costoUpgrade[i]) {
                this.upgradeButtons[i].style.backgroundColor = '#03a909ff';
              }
              if(this.money < this.autoClickerCost[i]) {
                this.autoClickers[i].style.backgroundColor = 'rgb(166, 2, 2)';
              }
            }

            this.unlockAreaButtons[num-1].style.display = 'none';
            this.$refs.fourthArea.style.display = 'block';
            break;
        }
        this.tilemaps[num].style.opacity = '1';
      },

      // Mostra la schermata di vittoria
      vittoria() {
        this.$refs.victoryScreen.style.display = 'block';
      }
    },
});

app.mount('#app');
