let image = new Image();
image.src ='./sprites.png';

let canvas = document.querySelector('canvas');
let contexto = canvas.getContext('2d')



//plano de fundo
const planoDeFundo = {
    spriteX: 390,
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

  //chão
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
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
    gravidade:0.25,
    velocidade:0,
    atualiza(){

        flappyBird.velocidade = flappyBird.velocidade +flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;

    },
    desenha(){
        contexto.drawImage(
            image,
            flappyBird.spriteX,flappyBird.spriteY, //Sprite x e y
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

    },
    atualiza(){
        flappyBird.atualiza();

    }
};

function loop(){
  
    telaAtiva.desenha();
    telaAtiva.atualiza();
 
    
    requestAnimationFrame(loop);
}

canvas.addEventListener('click',()=>{
if(telaAtiva.click){
    telaAtiva.click();
}

})

mudaTela(telas.INICIO);
loop()