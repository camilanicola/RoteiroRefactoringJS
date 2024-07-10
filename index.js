const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  let totalFatura = calcularTotalFatura(fatura.apresentacoes, pecas);

  for (let apre of fatura.apresentacoes) {
    const totalApresentacao = calcularTotalApresentacao(apre, pecas);
    faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(totalApresentacao / 100)} (${apre.audiencia} assentos)\n`;
  }

  const creditos = calcularTotalCreditos(fatura.apresentacoes, pecas);

  faturaStr += `Valor total: ${formatarMoeda(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;

  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = `<h1>Fatura ${fatura.cliente}</h1>\n`;
  let totalFatura = calcularTotalFatura(fatura.apresentacoes, pecas);

  faturaHTML += `<table>\n`;
  faturaHTML += `<tr><th>Peça</th><th>Assentos</th><th>Preço</th></tr>\n`;

  for (let apre of fatura.apresentacoes) {
    const totalApresentacao = calcularTotalApresentacao(apre, pecas);
    faturaHTML += `<tr><td>${getPeca(apre, pecas).nome}</td><td>${apre.audiencia}</td><td>${formatarMoeda(totalApresentacao / 100)}</td></tr>\n`;
  }

  const creditos = calcularTotalCreditos(fatura.apresentacoes, pecas);

  faturaHTML += `</table>\n`;
  faturaHTML += `<p>Valor total: ${formatarMoeda(totalFatura / 100)}</p>\n`;
  faturaHTML += `<p>Créditos acumulados: ${creditos}</p>\n`;

  return faturaHTML;
}

function calcularTotalApresentacao(apre, pecas) {
  let total = 0;

  switch (getPeca(apre, pecas).tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${getPeca(apre, pecas).tipo}`);
  }
  return total;
}

function getPeca(apresentacao, pecas) {
  return pecas[apresentacao.id];
}

function calcularTotalCreditos(apresentacoes, pecas) {
  let creditos = 0;
  for (let apre of apresentacoes) {
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre, pecas).tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }
  }
  return creditos;
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor);
}

function calcularTotalFatura(apresentacoes, pecas) {
  let totalFatura = 0;
  for (let apre of apresentacoes) {
    totalFatura += calcularTotalApresentacao(apre, pecas);
  }
  return totalFatura;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);

const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);
