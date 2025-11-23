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
    button.style.transform = "translateY(3px) scale(0.97)";
    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    setTimeout(() => {
        button.style.transform = "translateY(0) scale(1)";
        button.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
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
        costoUpgrade: [10, 150, 600, 1300],

        // Costo per sbloccare nuove aree di gioco
        costoArea: [200, 1000, 5000],

        // Fattore di moltiplicazione applicato al costo upgrade dopo ogni acquisto
        moltiplicatoreUpgrade: [1.5, 1.5, 1.5, 1.5],

        // Livello dell’upgrade di ciascuna risorsa
        livelloUpgrade: [0, 0, 0, 0],

        // Costo iniziale di ogni auto-clicker
        autoClickerCost: [100, 220, 500, 1000],

        // Array che conterranno i riferimenti ai pulsanti del gioco
        clickButtons: [],
        sellButtons: [],
        upgradeButtons: [],
        unlockAreaButtons: [],
        autoClickers: [],
        textCycle: [],
        counterButtons: [],
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
      click(num) {
        const sellButton = this.sellButtons[num];
        sellButton.style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
        const button = this.clickButtons[num];

        // Animazione visiva del pulsante
        animazioneBottone(button);

        // Aumento risorsa in base al tipo e agli upgrade
        switch(num) {
          case 0:
            this.contMais = Math.round((this.contMais + 1 + (0.1 * this.livelloUpgrade[0])) * 10) / 10;
            break;
          case 1:
            this.contCarrot = Math.round((this.contCarrot + 1 + (0.2 * this.livelloUpgrade[1])) * 10) / 10;
            break;
          case 2:
            this.contTomatoes = Math.round((this.contTomatoes + 1 + (0.3 * this.livelloUpgrade[2])) * 10) / 10;
            break;
          case 3:
            this.contPotatoes = Math.round((this.contPotatoes + 1 + (0.4 * this.livelloUpgrade[3])) * 10) / 10;
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

      },

      // Logica della vendita risorse
      sell(num) {
        let moneyEarned = 0;

        // Calcola introito e azzera la risorsa
        switch(num) {
          case 0:
            moneyEarned = this.contMais * 2;
            this.contMais = 0;
            break;
          case 1:
            moneyEarned = this.contCarrot * 3;
            this.contCarrot = 0;
            break;
          case 2:
            moneyEarned = this.contTomatoes * 5;
            this.contTomatoes = 0;
            break;
          case 3:
            moneyEarned = this.contPotatoes * 8;
            this.contPotatoes = 0;
            break;
        }

        // Aggiunge denaro con arrotondamento a 1 decimale
        this.money += Math.round(moneyEarned * 10) / 10;
        this.money = Number(this.money.toFixed(1));

        const button = this.sellButtons[num];
        animazioneBottone(button);
        button.style.backgroundColor = '#03a909ff';

        // Se il giocatore può comprare un upgrade, evidenzia il pulsante
        if(this.money >= this.costoUpgrade[num]) {
          this.upgradeButtons[num].style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
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
          if(this.money < this.costoUpgrade[num]) {
            button.style.backgroundColor = '#03a909ff';
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
        if(this.money < this.autoClickerCost[num]) return;

        this.contAutoClicker[num]++;

        // Se è il primo auto-clicker, attiva un timer che genera risorse automaticamente
        if(this.contAutoClicker[num] == 1) {
          setInterval(() => {
            if(num == 0) this.contMais += this.contAutoClicker[0];
            else if(num == 1) this.contCarrot += this.contAutoClicker[1];
            else if(num == 2) this.contTomatoes += this.contAutoClicker[2];
            else if(num == 3) this.contPotatoes += this.contAutoClicker[3];

            // Colora il pulsante di vendita per indicare disponibilità
            this.sellButtons[num].style.backgroundColor = 'rgba(3, 227, 3, 0.8)';
          }, 1000);
        }

        // Pagamento e raddoppio del costo del prossimo auto-clicker
        this.money -= this.autoClickerCost[num];
        this.money = Number(this.money.toFixed(1));
        this.autoClickerCost[num] += this.autoClickerCost[num] / this.contAutoClicker[num];

        // Aggiornamenti visuali dei pulsanti
        if(this.money < this.autoClickerCost[num]) {
          this.autoClickers[num].style.backgroundColor = 'rgb(166, 2, 2)';
        }
        if(this.money < this.costoUpgrade[num]) {
          this.upgradeButtons[num].style.backgroundColor = '#03a909ff';
        }
      },

      // Sblocco di nuove aree di gioco
      unlockArea(num) {

        switch(num) {

          case 1:
            if(this.money < this.costoArea[num - 1]) return;
            this.money -= this.costoArea[num - 1];
            this.money = Number(this.money.toFixed(1));

            // Nasconde il pulsante e mostra nuova area
            this.unlockAreaButtons[num-1].style.display = 'none';
            this.$refs.secondArea.style.display = 'block';
            break;

          case 2:
            if(this.money < this.costoArea[num - 1]) return;
            this.money -= this.costoArea[num - 1];
            this.money = Number(this.money.toFixed(1));

            this.unlockAreaButtons[num-1].style.display = 'none';
            this.$refs.thirdArea.style.display = 'block';
            break;

          case 3:
            if(this.money < this.costoArea[num - 1]) return;
            this.money -= this.costoArea[num - 1];
            this.money = Number(this.money.toFixed(1));

            this.unlockAreaButtons[num-1].style.display = 'none';
            this.$refs.fourthArea.style.display = 'block';
            break;
        }
      },

      // Mostra la schermata di vittoria
      vittoria() {
        this.$refs.victoryScreen.style.display = 'block';
      }
    },
});

app.mount('#app');
