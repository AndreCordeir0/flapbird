let image = new Image();
image.src = './sprites.png';

let canvas = document.querySelector('canvas');
let contexto = canvas.getContext('2d')
let framesFlappyBird = 0
const PIXEL_INICIAL_ENTRE_TUBOS = 100;
const FPS = 60;
let score = 0;
let best = 0;
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

function hasColisao() {
    let flappyBirdY = flappyBird.y + flappyBird.altura;
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
function tuboFactory() {
    const tubo = 
    {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        pares: [],
        x: 410,
        y: 0,
        contadoPontuacao: false,
        desenha()  {
            if (tubo?.tuboChao?.x === -tubo?.largura) {
                tubo.tuboChao.x = tubo.x;
                tubo.tuboCeu.x = tubo.x;
                tubo.contadoPontuacao = false;
            }
            const espacamentoEntreTubos = 60;

            let alturaDoTubo = Math.floor(Math.random() * 100);
            let tuboCeuX
            let tuboCeuY;
            const sinal = Math.floor(Math.random() * 2);
            if (tubo.tuboCeu) {
                tuboCeuX = tubo.tuboCeu.x;
                tuboCeuY = tubo.tuboCeu.y;
            }  else {
                tuboCeuX = tubo.x;
                if (sinal === 0) {
                    tuboCeuY = tubo.y  - espacamentoEntreTubos - 240 + alturaDoTubo;
                } else {
                    tuboCeuY = tubo.y  - espacamentoEntreTubos - 240 - alturaDoTubo;
                }
            }
            //Tubo do céu
            contexto.drawImage(
                image,
                tubo.ceu.spriteX, tubo.ceu.spriteY,
                tubo.largura, tubo.altura,
                tuboCeuX, tuboCeuY,
                tubo.largura, tubo.altura,
            )
    
            //Tubo do chão
            let tuboChaoX
            let tuboChaoY;
            if (tubo.tuboChao) {
                tuboChaoX = tubo.tuboChao.x;
                tuboChaoY = tubo.tuboChao.y;
            } else {
                tuboChaoX = tubo.x;
                if (sinal === 0) {
                    tuboChaoY = 160 + espacamentoEntreTubos + alturaDoTubo;
                } else {
                    tuboChaoY = 160 + espacamentoEntreTubos - alturaDoTubo;
                }
            }
    
            contexto.drawImage(
                image,
                tubo.chao.spriteX, tubo.chao.spriteY,
                tubo.largura, tubo.altura,
                tuboChaoX, tuboChaoY,
                tubo.largura, tubo.altura,
            )
    
            tubo.tuboCeu = {
                x: tuboCeuX,
                y: tuboCeuY
            }
            tubo.tuboChao = {
                x: tuboChaoX,
                y: tuboChaoY
            }
        },
        hasColisao() {
            const bicoDoPassaro = flappyBird.x + flappyBird.largura;
            const parteDeBaixoDoPassaro = flappyBird.y + flappyBird.altura;
            const pontaDoTuboCeu = tubo.tuboCeu.y + tubo.altura;
            const pontaDoTuboChao = tubo.tuboChao.y;
            return (
                (bicoDoPassaro === tubo.tuboCeu.x && flappyBird.y <= pontaDoTuboCeu)
                || 
            flappyBird.y <= pontaDoTuboCeu && (flappyBird.x <= tubo?.tuboCeu?.x + tubo?.largura && flappyBird?.x >= tubo?.tuboCeu.x)
            ||
            (bicoDoPassaro === tubo.tuboChao.x && parteDeBaixoDoPassaro >= tubo.tuboChao.y)
            ||
            parteDeBaixoDoPassaro >= pontaDoTuboChao && (flappyBird.x <= tubo?.tuboChao?.x + tubo?.largura && flappyBird?.x >= tubo?.tuboChao.x)
        );
        },
        atualiza() {
            if (tubo.tuboCeu.x <= flappyBird.x && !tubo.contadoPontuacao) {
                tubo.contadoPontuacao = true;
                score++;
            }
            
            if (
               tubo.hasColisao()
            ) {
                alterarTelaAtual(telas.TELA_PONTUACAO);
                resetarGame();
                return;
            }
            const frame = framesFlappyBird % 1;
            if (frame === 0) {
                tubo.tuboCeu.x = tubo.tuboCeu.x - 1;
                tubo.tuboChao.x = tubo.tuboChao.x - 1;
            }   
        }
    }
    return tubo;
}

const telaPontuacao = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    medalhas: {
        vazio: {
            spriteX: 0,
            spriteY: 78,
            largura: 44,
            altura: 44,
        },
        bronze: {
            spriteX: 47,
            spriteY: 124,
            largura: 44,
            altura: 44,
        },
        prata: {
            spriteX: 47,
            spriteY: 78,
            largura: 44,
            altura: 44,
        },
        ouro: {
            spriteX: 0,
            spriteY: 124,
            largura: 44,
            altura: 44,
        }
    },
    desenha() {
        let medalha;
        if (score >= 0) {
            medalha = 'vazio';
        }
        if (score > 9) {
            medalha = 'bronze';
        }
        if (score > 50) {
            medalha = 'prata';
        }
        if (score > 99) {
            medalha = 'ouro';
        }
        //Placar
        contexto.drawImage(
            image,
            telaPontuacao.spriteX, telaPontuacao.spriteY,
            telaPontuacao.largura, telaPontuacao.altura,
            telaPontuacao.x, telaPontuacao.y,
            telaPontuacao.largura, telaPontuacao.altura,
        );

        //Medalha
        contexto.drawImage(
            image,
            telaPontuacao.medalhas[medalha].spriteX, telaPontuacao.medalhas[medalha].spriteY,
            telaPontuacao.medalhas[medalha].largura, telaPontuacao.medalhas[medalha].altura,
            telaPontuacao.x + 25, telaPontuacao.y + 86,
            telaPontuacao.medalhas[medalha].largura, telaPontuacao.medalhas[medalha].altura,
        );

        drawScore(score, telaPontuacao.x + 175, telaPontuacao.y + 100);
        drawScore(best, telaPontuacao.x + 175, telaPontuacao.y + 145);
        
    }
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
    pulo: 3.6,
    pula() {
        flappyBird.velocidade = -flappyBird.pulo;
    },
    gravidade: 0.15,
    velocidade: 0,
    atualiza() {
        if (hasColisao()) {
            alterarTelaAtual(telas.TELA_PONTUACAO);
            resetarGame();
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
function resetarGame() {
    flappyBird.x = 10;
    flappyBird.y = 50;
    flappyBird.velocidade = 0;
    tubos = [];
    if (score > best)
        best = score;
    
    // best = 0;
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


//Telas
const telas = {
    INICIO: {
        desenha() {
            planoDeFundo.desenha();
            terreno.desenha();
            flappyBird.desenha();
            cenario.desenha();
            getReady.desenha();
            tubos = [];
        },
        click() {
            alterarTelaAtual(telas.INICIAR_JOGO);
            score = 0;
        },
        atualiza() {
            framesFlappyBird++;
        },
        spaceKeyboardEvent() {
            alterarTelaAtual(telas.INICIAR_JOGO);
        }
    },
    INICIAR_JOGO: {
        desenha() {
            //A ordem importa para o z-index das imagens, a primeira a ser desenhada fica por baixo
            planoDeFundo.desenha();
            cenario.desenha();
            desenharCanos();
            terreno.desenha();
            flappyBird.desenha();
        },
        click() {
            flappyBird.pula();
        },
        atualiza() {
            flappyBird.atualiza();
        },
        spaceKeyboardEvent() {
            flappyBird.pula();
        }
    },
    TELA_PONTUACAO: {
        desenha() {
            telaPontuacao.desenha();
        },
        atualiza() {},
        click() {
            alterarTelaAtual(telas.INICIAR_JOGO);
            score = 0;
        },
        spaceKeyboardEvent() {
            alterarTelaAtual(telas.INICIAR_JOGO);
            score = 0;
        }
    }
};
let tubos = [];
function desenharCanos() {
    const frames = framesFlappyBird % 300;
    if (frames === 0 && tubos.length < 3) {
        const tubo = tuboFactory();
        tubos.push(tubo);
    }
    tubos.forEach(tubo => {
        tubo.desenha(); 
    });
}

function drawScore(pontuacao = score , posicaoX = canvas.width - 40, posicaoY = 35) {
    contexto.font = '20px "Press Start 2P"';
    contexto.fillStyle = 'white';
    contexto.fillText(pontuacao, posicaoX, posicaoY);
}

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    cenario.atualiza();
    terreno.atualiza();
    drawScore();
    tubos.forEach(tubo => {
        tubo.atualiza();
    });
    requestAnimationFrame(loop);
}

canvas.addEventListener('click', () => {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (telaAtiva.spaceKeyboardEvent) {
            telaAtiva.spaceKeyboardEvent();
        }
    }
});
alterarTelaAtual(telas.INICIO);
loop();