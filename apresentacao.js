const { formatarMoeda } = require('./util');

function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    let totalFatura = calc.calcularTotalFatura(fatura.apresentacoes);
  
    for (let apre of fatura.apresentacoes) {
      const totalApresentacao = calc.calcularTotalApresentacao(apre);
      faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(totalApresentacao / 100)} (${apre.audiencia} assentos)\n`;
    }
  
    const creditos = calc.calcularTotalCreditos(fatura.apresentacoes);
  
    faturaStr += `Valor total: ${formatarMoeda(totalFatura / 100)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
  
    return faturaStr;
  }

  module.exports = { gerarFaturaStr };