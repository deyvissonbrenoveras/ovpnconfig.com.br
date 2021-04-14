const paypal = require("paypal-rest-sdk");
const paypalConfig = require("../config/paypal");
const products = require("../config/products");
const User = require("../models/User");

paypal.configure(paypalConfig);


const buyPage = (req, res)=>{    
    return res.render("buy", {products, user: req.user, currency: req.query.currency || "USD"});
}
const buy = (req, res)=>{
    let currency = req.body.currency;
    let produto = products[currency].filter(prod=> prod.id == req.body.produto)[0]; 
    const carrinho = [
        {
            "name": produto.titulo,
            "sku": produto.id,
            "price": Number(produto.preco).toFixed(2),
            "currency": currency,
            "quantity": 1
        }
    ]
    let valor = {"currency": currency, "total": produto.preco};
    const descricao = produto.descricao;

    var siteUrl
    if (req.get("host").includes("localhost:3000")){
        siteUrl = 'http://' + req.get('host');
    }
    else{
        siteUrl = 'https://' + req.get('host');
    }

    const jsonPagamento = {
        "intent": "sale",
        "payer": {payment_method: "paypal"},
        "redirect_urls": {
            "return_url": siteUrl + "/buy/success",
            "cancel_url": siteUrl,
            
        },
        "transactions": [{
            "item_list": {"items": carrinho},
            "amount": valor,
            "description": descricao
        }]
    }
    paypal.payment.create(jsonPagamento, (err, pagamento)=> {
        if (err){
            console.log(err);
        }
        else{
            pagamento.links.forEach(link=>{
                if (link.rel == "approval_url"){
                    User.findById(req.user._id, (err, user)=>{
                        if(err)
                            console.log(err);
                        else{
                            //Salva as informações da transação e define a validade do premium
                            user.valorCarrinho = valor;
                            user.valorCarrinho.dias = produto.dias
                            user.save();
                        }    
                        return res.redirect(link.href);                        
                    })
                }
            })
        }
    })
    
}

const success = (req, res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    User.findById(req.user._id, (err, user)=>{
        if(err){
            console.log(err);
            return res.redirect("/");
        }
        else{                  
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {"currency": user.valorCarrinho.currency, "total": user.valorCarrinho.total}
                }]
            }
            paypal.payment.execute(paymentId, execute_payment_json, (err, payment)=>{
                if (err){
                    console.log(err.response);
                    return res.redirect("/");
                }
                else{           
                    user.historicoPagamento.push(JSON.stringify(payment));
	                let vencimento = new Date(Date.now());
                    vencimento.setDate(vencimento.getDate() + Number(user.valorCarrinho.dias))
                    user.vencimentoPremium = vencimento;
                    user.save();
                    return res.render("buySuccess", {user: req.user});
                }    
            });
        }          
    })
    
    
    
}
const cancel = (req, res)=>{
    return res.send("cancel");
}
module.exports = {
    buyPage,
    success,
    cancel,
    buy
}