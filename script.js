// Lista com os jogos 
const jogos = [
[3, 4, 42, 46, 51, 55, 59, 60],
[5, 7, 10, 11, 16, 19, 56, 59],
[18, 22, 24, 29, 30, 36, 43, 58],
[4, 6, 17, 22, 23, 30, 32, 49],
[1, 10, 12, 18, 19, 54, 57, 60],
[5, 13, 16, 22, 28, 46, 47, 59],
[4, 7, 24, 30, 31, 39, 40, 60],
[14, 21, 22, 30, 32, 36, 37, 38],
[1, 10, 11, 17, 18, 34, 40, 45],
[11, 12, 30, 32, 43, 55, 56, 58],
].map((jogo, index) => ({
  numeros: jogo,
  id: Math.floor((index / 3) + 1), // Número do Volante
  numero_jogo: Math.floor(index + 1), // Nomero do Jogo
}));

// Usar seta esquerda ou direita
document.addEventListener("keydown", (event) => {
  const fields = document.querySelectorAll("input"); // Seleciona os campos das dezenas
  let currentIndex = -1;

  // Encontra o campo atualmente focado
  fields.forEach((field, index) => {
    if (document.activeElement === field) {
      currentIndex = index;
    }
  });

  if (currentIndex !== -1) {
    if (event.key === "ArrowLeft" && currentIndex > 0) {
      // Vai para o campo anterior
      fields[currentIndex - 1].focus();
    } else if (event.key === "ArrowRight" && currentIndex < fields.length - 1) {
      // Vai para o próximo campo
      fields[currentIndex + 1].focus();
    }
  }
});

// Dividir a lista colada em cada campo de dezena
document.getElementById("paste-dezenas").addEventListener("input", (event) => {
  const input = event.target.value.trim(); // Pega o valor colado
  const fields = document.querySelectorAll("input");

  // Divida os números por vírgula, espaço ou ambos
  const dezenas = input.split(/[\s,]+/).map(num => parseInt(num.trim())).filter(Boolean);

  // Preenche os campos com as dezenas
  fields.forEach((field, index) => {
    field.value = dezenas[index] || ""; // Preenche ou limpa o campo
  });
});

// Função para buscar e destacar
function buscarJogos() {
  const inputs = Array.from(document.querySelectorAll('input'));
  const numerosDigitados = inputs.map(input => parseInt(input.value)).filter(Boolean);

  const quadras = [];
  const quinas = [];
  const senas = [];

  jogos.forEach(jogo => {
    const acertos = numerosDigitados.filter(num => jogo.numeros.includes(num)).length;

    if (acertos == 4) quadras.push(jogo); // Adicionar todos os jogos com 4+ acertos no campo de quadras
    if (acertos == 5) quinas.push(jogo); // Adicionar todos os jogos com 5+ acertos no campo de quinas
    if (acertos === 6) senas.push(jogo); // Adicionar jogos com 6 acertos no campo de senas
  });

  atualizarResultados(quadras, quinas, senas, numerosDigitados);
}

// Função para exibir os resultados separados
function atualizarResultados(quadras, quinas, senas, numerosDigitados) {
  const quadrasDiv = document.getElementById('quadras');
  const quinasDiv = document.getElementById('quinas');
  const senasDiv = document.getElementById('senas');
  const totalQuadrasDiv = document.getElementById('total-quadras');
  const totalQuinasDiv = document.getElementById('total-quinas');

  // Limpar os campos anteriores
  quadrasDiv.innerHTML = '';
  quinasDiv.innerHTML = '';
  senasDiv.innerHTML = '';
  totalQuadrasDiv.textContent = 'Total de quadras: 0';
  totalQuinasDiv.textContent = 'Total de quinas: 0';

  // Atualizar quadras
  quadras.forEach(jogo => {
    const linha = document.createElement('div');
    linha.innerHTML = formatarJogo(jogo, numerosDigitados);
    quadrasDiv.appendChild(linha);
  });

  // Atualizar quinas
  quinas.forEach(jogo => {
    const linha = document.createElement('div');
    linha.innerHTML = formatarJogo(jogo, numerosDigitados);
    quinasDiv.appendChild(linha);
  });

  // Atualizar senas
  senas.forEach(jogo => {
    const linha = document.createElement('div');
    linha.innerHTML = formatarJogo(jogo, numerosDigitados);
    senasDiv.appendChild(linha);
  });

  // Exibir totais
  totalQuadrasDiv.textContent = `Total de quadras: ${quadras.length}`;
  totalQuinasDiv.textContent = `Total de quinas: ${quinas.length}`;

  atualizarMensagem(quadras, quinas, senas);
}

// Função para formatar um jogo e destacar os números coincidentes
function formatarJogo(jogo, numerosDigitados) {
  const numerosFormatados = jogo.numeros.map(numero =>
    numerosDigitados.includes(numero)
      ? `<span class="highlight">${numero}</span>`
      : numero
  ).join(', ');
// Formatação número do jogo
  return `<span class="jogo-id">🎯 Jogo ${jogo.numero_jogo} 💰 Dezenas: </span> ${numerosFormatados}`;
}

// Função para atualizar a mensagem principal
function atualizarMensagem(quadras, quinas, senas) {
  const resultMessage = document.getElementById('result-message');

  if (senas.length > 0) {
    resultMessage.textContent = "Espetacular! Você acertou a SENA e está RICO!!!";
  } else if (quinas.length > 0) {
    resultMessage.textContent = "Maravilha! Está quase rico, você acertou a QUINA!!!";
  } else if (quadras.length > 0) {
    resultMessage.textContent = "Parabéns! Você acertou a QUADRA!!";
  } else {
    resultMessage.textContent = "Vai dar certo! Fé!!";
  }
}

// Função para limpar campos e resultados
function limparCampos() {
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.getElementById('result-message').textContent = "Vai dar certo! Fé!!";
  document.getElementById('quadras').innerHTML = '';
  document.getElementById('quinas').innerHTML = '';
  document.getElementById('senas').innerHTML = '';
}

// Adicionar evento para cada campo de entrada
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', buscarJogos);
});

// Adicionar evento para o botão de limpar
document.getElementById('clear-button').addEventListener('click', limparCampos);
