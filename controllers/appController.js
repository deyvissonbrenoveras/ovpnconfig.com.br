const forge = require("node-forge");
const validateIP = require("validate-ip-node");
const UseLimit = require("../models/UseLimit");

var pki = forge.pki;
const index = (req, res) => {
  res.render("index", { user: req.user });
};

const sobre = (req, res) => {
  res.render("sobre", { user: req.user });
};

let defaultConfig = `client
dev tun
proto tcp-client
persist-key
persist-tun
tls-client
remote-cert-tls server
verb 4
auth-nocache
mute 10\r\n`;

const generateConfig = async function (req, res) {
  let ip = req.headers.ip;

  let ovpnConfig = req.body;
  let config = { ovpnConfig: defaultConfig, message: "" };
  config.ovpnConfig += "remote " + ovpnConfig.remote + "\r\n";
  config.ovpnConfig += "port " + ovpnConfig.port + "\r\n";
  config.ovpnConfig += "auth " + ovpnConfig.auth + "\r\n";
  config.ovpnConfig += "cipher " + ovpnConfig.cipher + "\r\n";

  if (ovpnConfig.redirectGateway) {
    config.ovpnConfig += "redirect-gateway def1\r\n";
  }

  if (ovpnConfig.r1Destination && ovpnConfig.r1Mask && ovpnConfig.r1Gateway) {
    if (
      !validateIP(ovpnConfig.r1Destination) ||
      !validateIP(ovpnConfig.r1Mask) ||
      !validateIP(ovpnConfig.r1Gateway)
    ) {
      config.message = "Please insert a valid route";
      return res.status(406).json(config);
    }
    config.ovpnConfig += `push "route ${ovpnConfig.r1Destination} ${ovpnConfig.r1Mask} ${ovpnConfig.r1Gateway} 1"\r\n`;
  }

  config.ovpnConfig += "auth-user-pass credentials.txt\r\n";

  if (ovpnConfig.requireCertificate) {
    //Valida certificados
    let invalidatedCerts = false;

    if (!(await validateCert(ovpnConfig.caCertificate))) {
      invalidatedCerts = true;
      config.message += "Invalid Ca Certificate\r\n";
    }

    if (!(await validateCert(ovpnConfig.clientCertificate))) {
      invalidatedCerts = true;
      config.message += "Invalid Client Certificate\r\n";
    }

    let clientkeyValidation = await validateKey(ovpnConfig.clientKey);

    if (clientkeyValidation == 2) {
      invalidatedCerts = true;
      config.message += "Invalid Client key\r\n";
    }

    if (invalidatedCerts) return res.status(406).json(config);

    let certConfigString = "ca [inline]\r\ncert [inline]\r\nkey [inline]\r\n";
    certConfigString += "<ca>\r\n" + ovpnConfig.caCertificate + "\r\n</ca>\r\n";
    certConfigString +=
      "<cert>\r\n" + ovpnConfig.clientCertificate + "\r\n</cert>\r\n";

    if (clientkeyValidation == 1) {
      certConfigString += "<key>\r\n" + ovpnConfig.clientKey + "\r\n</key>\r\n";
    } else {
      //desencripta a key
      try {
        var privateKey = await pki.decryptRsaPrivateKey(
          ovpnConfig.clientKey,
          ovpnConfig.passphrase
        );
        var pem = await pki.privateKeyToPem(privateKey);
        certConfigString += "<key>\r\n" + pem + "\r\n</key>\r\n";
      } catch (err) {
        certConfigString = "";
        config.message = "Wrong passphrase.";
        return res.status(406).json(config);
      }
    }
    config.ovpnConfig += certConfigString;
  }
  config.message = "Validated Information";
  if (!req.user) {
    UseLimit.create(
      { ip: ip, date: new Date(Date.now()).toLocaleDateString() },
      (err, useLimit) => {
        if (err) console.log(err);
        return res.json(config);
      }
    );
  } else {
    return res.json(config);
  }
};
const redirectHttps = function (req, res, next) {
  if (
    req.host === "ovpnconfig.com.br" &&
    req.headers["x-forwarded-proto"] != "https"
  ) {
    // checa se o header é HTTP ou HTTPS
    res.redirect("https://" + req.headers.host + req.url);
    // faz o redirect para HTTPS
  } else {
    next();
    // segue com a sequência das rotas
  }
};
const checkUserLimit = (req, res, next) => {
  let ip = req.headers.ip;
  let now = new Date(new Date(Date.now()).toLocaleDateString());

  if (req.user) {
    if (now <= req.user.vencimentoTrial) {
      next();
    } else if (now > req.user.vencimentoPremium) {
      return res.status(402).json({
        message: "Your license has expired, please renew your subscription",
      });
    } else {
      next();
    }
  } else {
    UseLimit.find({ ip: ip, date: { $gte: now } }, (err, userLimits) => {
      if (err) {
        console.log(err);
        next();
      }
      if (userLimits && userLimits.length >= process.env.USER_DAILY_LIMIT) {
        return res.status(401).json({
          message: `You have reached the daily limit of ${process.env.USER_DAILY_LIMIT} generated files, please update your subscription`,
        });
      } else {
        next();
      }
    });
  }
};
function validateCert(cert) {
  //valida certificados
  const CERT_HEADER = "-----BEGIN CERTIFICATE-----";
  const CERT_FOOTER = "-----END CERTIFICATE-----";
  if (!cert.includes(CERT_HEADER) | !cert.includes(CERT_FOOTER)) return false;
  else return true;
}
/*Validação da Key
Retorna 0 se a key for validada e ainda estiver encriptada
Retorna 1 se a key for validada e estiver decryptada
Retorna 2 se a key não for validada
*/
function validateKey(key) {
  const ENCRYPTED_KEY_HEADER = "-----BEGIN ENCRYPTED PRIVATE KEY-----";
  const ENCRYPTED_KEY_FOOTER = "-----END ENCRYPTED PRIVATE KEY-----";
  const DECRYPTED_KEY_HEADER = "-----BEGIN RSA PRIVATE KEY-----";
  const DECRYPTED_KEY_FOOTER = "-----END RSA PRIVATE KEY-----";
  if (key.includes(ENCRYPTED_KEY_HEADER) & key.includes(ENCRYPTED_KEY_FOOTER))
    return 0;
  else if (
    key.includes(DECRYPTED_KEY_HEADER) & key.includes(DECRYPTED_KEY_FOOTER)
  )
    return 1;
  else return 2;
}
module.exports = {
  index,
  sobre,
  generateConfig,
  redirectHttps,
  checkUserLimit,
};
