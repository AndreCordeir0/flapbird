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


function loop(){
  
flappyBird.atualiza();

    planoDeFundo.desenha();
    chao.desenha();
    flappyBird.desenha();

    requestAnimationFrame(loop);
}
loop()