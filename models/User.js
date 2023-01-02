const mongoose = require("mongoose");
const valorCarrinhoSchema = mongoose.Schema({
  currency: { type: String },
  total: { type: String },
  dias: { type: Number },
});
const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  vencimentoTrial: { type: Date, default: new Date("01-01-2000") },
  password: { type: String, required: true },
  valorCarrinho: { type: valorCarrinhoSchema },
  vencimentoPremium: { type: Date, default: new Date("01-01-2000") },
  historicoPagamento: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
