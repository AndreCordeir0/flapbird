let image = new Image();
image.src ='./sprites.png';

let canvas = document.querySelector('canvas');
let contexto = canvas.getContext('2d')
let frames = 0


//plano de fundo
const planoDeFundo = {
    spriteX: 1390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
      contexto.fillStyle = '#70c5ce';
      contexto.fillRect(0,0, canvas.width, canvas.height)
  
      contexto.drawImage(
        image,
        planoDeFundo.spriteX, planoDeFundo.spriteY,
        planoDeFundo.largura, planoDeFundo.altura,
        planoDeFundo.x, planoDeFundo.y,
        planoDeFundo.largura, planoDeFundo.altura,
      );
  
      contexto.drawImage(
        image,
        planoDeFundo.spriteX, planoDeFundo.spriteY,
        planoDeFundo.largura, planoDeFundo.altura,
        (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
        planoDeFundo.largura, planoDeFundo.altura,
      );
    },
  };

function fazColisao(flappyBird,chao){

    let flappyBirdY = flappyBird.y+ flappyBird.altura
    let chaoY =  chao.y
    if(flappyBirdY >= chaoY){
        console.log('tocou');
        return true;
    }return false;
}


  //chão
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza(){
        const movimentoDoChao = 1;
        const repeteEm = chao.largura /2
        const movimentacao = chao.x - movimentoDoChao
        chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        image,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        image,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };




  
  const flappyBird = {
    spriteX : 0,
    spriteY: 0,
    largura:33,
    altura :24,
    x:10,
    y:50,
    movimentos :[

        {spriteX:0, spriteY:0,},
        {spriteX:0, spriteY:26,},
        {spriteX:0, spriteY:52,},
        {spriteX:0, spriteY:26,},
    ],
    frameAtual :0,
    atualizaFrameAtual(){

        const intervaloDeFrames = 5;
        const passouIntervalo = frames % intervaloDeFrames === 0;
            if (passouIntervalo) {
                const baseDoIncremento = 1 
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao
            
            }
    },
    pulo:4.6,
    pula(){
        flappyBird.velocidade=- flappyBird.pulo;
    },
     gravidade:0.25,
    velocidade:0,
    atualiza(){
        if(fazColisao(flappyBird,chao)){
            console.log('colidiu');
            mudaTela(telas.INICIO)
            flappyBird.x =10;
            flappyBird.y = 50;
            flappyBird.velocidade=0;
            return;
        }

        flappyBird.velocidade = flappyBird.velocidade +flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;

    },mudança(){
    
    },
    desenha(){
        flappyBird.atualizaFrameAtual()
const {spriteX,spriteY} = flappyBird.movimentos[flappyBird.frameAtual];

        contexto.drawImage(
            image,
            spriteX,spriteY, //Sprite x e y
            flappyBird.largura,flappyBird.altura, //Largura e Altura
            flappyBird.x,flappyBird.y,
            flappyBird.largura,flappyBird.altura
        );
    }
    }

    const getReady ={
        spriteX : 134,
        spriteY: 0,
        largura:174,
        altura :152,
        x:(canvas.width / 2) - 174/2,
        y:50,
        desenha() {
            contexto.drawImage(
              image,
              getReady.spriteX, getReady.spriteY,
              getReady.largura, getReady.altura,
              getReady.x, getReady.y,
              getReady.largura, getReady.altura,
            );
    }}
//
//TELAS
//
let telaAtiva = {};

function mudaTela(novaTela){
    telaAtiva = novaTela;
}

//
//Colisão
//
function colisao(){
    if(flappyBird.y == canvas.offsetTop && flappyBird.altura == canvas.offsetHeight){
        console.log('Colidiu');
    }
}



//Telas
const telas = {
    INICIO:{
        desenha(){
            planoDeFundo.desenha();
            chao.desenha();
            flappyBird.desenha();
            getReady.desenha();
        },click(){

            mudaTela(telas.jogo);
        },
        atualiza(){

        }
       
    },
    
   
};

telas.jogo = {
    desenha(){
        planoDeFundo.desenha();
        chao.desenha();
        flappyBird.desenha();

    },click(){
        flappyBird.pula();
    },
    atualiza(){
        flappyBird.atualiza();

    }
};

function loop(){
  
    telaAtiva.desenha();
    telaAtiva.atualiza();
    chao.atualiza()
    flappyBird.mudança()
    requestAnimationFrame(loop);

}

canvas.addEventListener('click',()=>{
if(telaAtiva.click){
    telaAtiva.click();
}

})
colisao();
mudaTela(telas.INICIO);
loop()
