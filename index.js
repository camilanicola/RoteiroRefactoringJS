const { readFileSync } = require('fs');
const {gerarFaturaStr}= require('./apresentacao.js')
const { formatarMoeda } = require('./util');

var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servicos.js");


function gerarFaturaHTML(fatura, calc) {
  let faturaHTML = `<h1>Fatura ${fatura.cliente}</h1>\n`;
  let totalFatura = calc.calcularTotalFatura(fatura.apresentacoes);

  faturaHTML += `<table>\n`;
  faturaHTML += `<tr><th>Peça</th><th>Assentos</th><th>Preço</th></tr>\n`;

  for (let apre of fatura.apresentacoes) {
    const totalApresentacao = calc.calcularTotalApresentacao(apre);
    faturaHTML += `<tr><td>${calc.repo.getPeca(apre).nome}</td><td>${apre.audiencia}</td><td>${formatarMoeda(totalApresentacao / 100)}</td></tr>\n`;
  }

  const creditos = calc.calcularTotalCreditos(fatura.apresentacoes);

  faturaHTML += `</table>\n`;
  faturaHTML += `<p>Valor total: ${formatarMoeda(totalFatura / 100)}</p>\n`;
  faturaHTML += `<p>Créditos acumulados: ${creditos}</p>\n`;

  return faturaHTML;
}




const faturas = JSON.parse(readFileSync('./faturas.json'));
const repo = new Repositorio();
const calc = new ServicoCalculoFatura(repo);

const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);
