let image = new Image();
image.src = './sprites.png';

let canvas = document.querySelector('canvas');
let contexto = canvas.getContext('2d')
let framesFlappyBird = 0

const planoDeFundo = {
    spriteX: 1390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        desenharNaTela(planoDeFundo);
    },
};

function hasColisao(flappyBird) {
    let flappyBirdY = flappyBird.y + flappyBird.altura
    return flappyBirdY >= terreno.y;
}

//chão
const terreno = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
        const movimentoDoChao = 1;
        const repeteEm = terreno.largura / 2
        const movimentacao = terreno.x - movimentoDoChao
        terreno.x = movimentacao % repeteEm;
    },
    desenha() {
        desenharNaTela(terreno);
    },
};

const cenario = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: terreno.y - 204,
    atualiza () {
        const movimentoDoChao = 0.5;
        const repeteEm = cenario.largura;
        const movimentacao = cenario.x - movimentoDoChao;
        const inicioDesenhoX = movimentacao % repeteEm;
        cenario.x = inicioDesenhoX;
    },
    desenha() {
        contexto.drawImage(
            image,
            cenario.spriteX, cenario.spriteY,
            cenario.largura, cenario.altura,
            cenario.x, cenario.y,
            cenario.largura, cenario.altura,
        )
        contexto.drawImage(
            image,
            cenario.spriteX, cenario.spriteY,
            cenario.largura, cenario.altura,
            (cenario.x + cenario.largura), cenario.y,
            cenario.largura, cenario.altura,
        )
        contexto.drawImage(
            image,
            cenario.spriteX, cenario.spriteY,
            cenario.largura, cenario.altura,
            (cenario.x + cenario.largura + cenario.largura), cenario.y,
            cenario.largura, cenario.altura,
        )
    },
}


const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    movimentos: [
        {
            spriteX: 0,
            spriteY: 0,
        },
        {
            spriteX: 0,
            spriteY: 26,
        },
        {
            spriteX: 0,
            spriteY: 52,
        },
        {
            spriteX: 0,
            spriteY: 26,
        },
    ],
    frameAtual: 0,
    atualizaFrameAtual() {
        const intervaloDeFrames = 10;
        const passouIntervalo = framesFlappyBird % intervaloDeFrames === 0;
        if (passouIntervalo) {
            const baseDoIncremento = 1;
            const proximoFrameFlappyBird = baseDoIncremento + flappyBird.frameAtual;
            const quantidadeFramesDoFlappyBird = flappyBird.movimentos.length;
            flappyBird.frameAtual = proximoFrameFlappyBird % quantidadeFramesDoFlappyBird;
        }
    },
    pulo: 4.6,
    pula() {
        flappyBird.velocidade = -flappyBird.pulo;
    },
    gravidade: 0.15,
    velocidade: 0,
    atualiza() {
        if (hasColisao(flappyBird)) {
            alterarTelaAtual(telas.INICIO)
            flappyBird.x = 10;
            flappyBird.y = 50;
            flappyBird.velocidade = 0;
            return;
        }
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
        framesFlappyBird++;
    },
    desenha() {
        flappyBird.atualizaFrameAtual();
        const {
            spriteX,
            spriteY
        } = flappyBird.movimentos[flappyBird.frameAtual];

        contexto.drawImage(
            image,
            spriteX, spriteY,
            flappyBird.largura, flappyBird.altura,
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura
        );
    }
}

const getReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            image,
            getReady.spriteX, getReady.spriteY,
            getReady.largura, getReady.altura,
            getReady.x, getReady.y,
            getReady.largura, getReady.altura,
        );
    }
}

let telaAtiva = {};

function alterarTelaAtual(novaTela) {
    telaAtiva = novaTela;
}

function desenharNaTela(options = {}) {
    contexto.drawImage(
        image,
        options.spriteX, options.spriteY,
        options.largura, options.altura,
        options.x, options.y,
        options.largura, options.altura,
    )
    contexto.drawImage(
        image,
        options.spriteX, options.spriteY,
        options.largura, options.altura,
        (options.x + options.largura), options.y,
        options.largura, options.altura,
    )
}

//
//Colisão
//
function colisao() {
    if (flappyBird.y == canvas.offsetTop && flappyBird.altura == canvas.offsetHeight) {
        console.log('Colidiu');
    }
}



//Telas
const telas = {
    INICIO: {
        desenha() {
            planoDeFundo.desenha();
            terreno.desenha();
            flappyBird.desenha();
            cenario.desenha();
            getReady.desenha();
        },
        click() {
            alterarTelaAtual(telas.INICIAR_JOGO);
        },
        atualiza() {
            framesFlappyBird++;
        }
    },
    INICIAR_JOGO: {
        desenha() {
            //A ordem importa para o z-index das imagens, a primeira a ser desenhada fica por baixo
            planoDeFundo.desenha();
            cenario.desenha();
            terreno.desenha();
            flappyBird.desenha();
        },
        click() {
            flappyBird.pula();
        },
        atualiza() {
            flappyBird.atualiza();
        }
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    cenario.atualiza();
    terreno.atualiza();

    // flappyBird.mudança();
    requestAnimationFrame(loop);
}

canvas.addEventListener('click', () => {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});
colisao();
alterarTelaAtual(telas.INICIO);
loop()