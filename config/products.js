module.exports = {
    USD:[
        {
            id: 1,
            titulo: "1 Month",
            descricao: "1 Month of Mikrotik OpenVPN Config Generator premium access",
            "preco": process.env.PAYPAL_USD_ONE_MONTH,
            "dias": 30
        },
        {
            id: 2,
            titulo: "3 Months",
            descricao: "3 Months of Mikrotik OpenVPN Config Generator premium access",
            preco: process.env.PAYPAL_USD_THREE_MONTHS,
            dias: 90
        },
        {
            id: 3,
            titulo: "6 Months",
            descricao: "6 Months of Mikrotik OpenVPN Config Generator premium access",
            preco: process.env.PAYPAL_USD_SIX_MONTHS,
            dias: 180
        }
    ],
    BRL:[
        {
            id: 1,
            titulo: "1 Mes",
            descricao: "1 Mes de acesso premium no Mikrotik OpenVPN Config Generator",
            preco: process.env.PAYPAL_BRL_ONE_MONTH,
            dias: 30
        },
        {
            id: 2,
            titulo: "3 Meses",
            descricao: "3 Meses de acesso premium no Mikrotik OpenVPN Config Generator",
            preco: process.env.PAYPAL_BRL_THREE_MONTHS,
            dias: 90
        },
        {
            id: 3,
            titulo: "6 Meses",
            descricao: "6 Meses de acesso premium no Mikrotik OpenVPN Config Generator",
            preco: process.env.PAYPAL_BRL_SIX_MONTHS,
            dias: 180
        }
    ]
}