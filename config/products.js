module.exports = {
  USD: [
    {
      id: 2,
      titulo: "3 Months",
      descricao: "3 Months of Mikrotik OpenVPN Config Generator premium access",
      preco: process.env.PAYPAL_USD_THREE_MONTHS,
      dias: 90,
    },
    {
      id: 3,
      titulo: "6 Months",
      descricao: "6 Months of Mikrotik OpenVPN Config Generator premium access",
      preco: process.env.PAYPAL_USD_SIX_MONTHS,
      dias: 180,
    },
    {
      id: 4,
      titulo: "1 Year",
      descricao: "1 Year of Mikrotik OpenVPN Config Generator premium access",
      preco: process.env.PAYPAL_USD_ONE_YEAR,
      dias: 365,
    },
  ],
  BRL: [
    {
      id: 2,
      titulo: "3 Meses",
      descricao:
        "3 Meses de acesso premium no Mikrotik OpenVPN Config Generator",
      preco: process.env.PAYPAL_BRL_THREE_MONTHS,
      dias: 90,
    },
    {
      id: 3,
      titulo: "6 Meses",
      descricao:
        "6 Meses de acesso premium no Mikrotik OpenVPN Config Generator",
      preco: process.env.PAYPAL_BRL_SIX_MONTHS,
      dias: 180,
    },
    {
      id: 4,
      titulo: "1 Ano",
      descricao: "1 ano de acesso premium no Mikrotik OpenVPN Config Generator",
      preco: process.env.PAYPAL_BRL_ONE_YEAR,
      dias: 365,
    },
  ],
};
