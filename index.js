const { readFileSync } = require('fs');

function gerarFaturaStr(fatura) {
  function calcularTotalApresentacao(apre) {
    let total = 0;

    switch (getPeca(apre).tipo) {
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
        throw new Error(`Peça desconhecida: ${getPeca(apre).tipo}`);
    }
    return total;
  }

  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  function calcularTotalCreditos(apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(apre).tipo === "comedia") {
        creditos += Math.floor(apre.audiencia / 5);
      }
    }
    return creditos;
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor);
  }

  function calcularTotalFatura(apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
      totalFatura += calcularTotalApresentacao(apre);
    }
    return totalFatura;
  }

  let faturaStr = `Fatura ${fatura.cliente}\n`;
  let totalFatura = calcularTotalFatura(fatura.apresentacoes);

  for (let apre of fatura.apresentacoes) {
    const totalApresentacao = calcularTotalApresentacao(apre);
    faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(totalApresentacao / 100)} (${apre.audiencia} assentos)\n`;
  }

  const creditos = calcularTotalCreditos(fatura.apresentacoes);

  faturaStr += `Valor total: ${formatarMoeda(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;

  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas);
console.log(faturaStr);
