function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor);
  }
  module.exports = { formatarMoeda };