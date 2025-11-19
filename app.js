
const { createApp } = Vue;

function drawMap() {
  console.log("si")
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
      "esempio.jpg",
      
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

class Model {
  constructor() {
    this.data = [];
    this.subscribers = []; 
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach(callback => callback());
  }

  addData(item) {
    const newItem = { id: Date.now(), description: item }; 
    this.data.push(newItem);
    this.notify(); 
  }

  getAllData() {
    return this.data;
  }
}

class Controller {
  constructor(model) {
    this.model = model;
    // In un'architettura più pura, il Controller si registrerebbe qui.
    // this.model.subscribe(() => this.updateView()); 
  }

  handleUserAction(itemDescription) {
    if (itemDescription) {
      this.model.addData(itemDescription); 

    }
  }
  

  getModelState() {
      return this.model.getAllData();
  }
}

const taskModel = new Model();
const taskController = new Controller(taskModel);



const app = createApp({
    
    data() {
      return {
        controller: taskController, 
        model: taskModel, 
        newItemDescription: '',
        
        items: taskModel.getAllData() 
      }
    },
    

    methods: {
      onHoverStart() {
        const button = document.getElementById('bottoneStart');
        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = 'blue';
        button.style.boxShadow = '0 4px rgba(0, 0, 139, 0.6)';
      },
      onLeaveStart() {
        const button = document.getElementById('bottoneStart');
        button.style.transition = 'all 0.3s ease';
        button.style.backgroundColor = '#4CAF50';
        button.style.boxShadow = '0 4px green';
      },
      startGame() {
        document.getElementById("menuGioco").style.display = "none";
      },
      updateReactiveItems() {
        this.items = this.model.getAllData(); 
      }
    },
    
    mounted() {
        // Registra la funzione di aggiornamento di Vue al Model
        // Ogni volta che il Model chiama notify(), this.updateReactiveItems() viene eseguita.
        this.model.subscribe(this.updateReactiveItems);
        
        // Esegui il primo rendering (se necessario)
        this.updateReactiveItems();
    }
});


// 🚀 Monte l'applicazione sul tag <div id="app"></div> (simulato)
app.mount('#app');
