//Elementos
let remote = $("#remote");
let port = $("#port");
var auth;
var cipher;
let configOvpn = $("#configOvpn");
let redirectGateway = $("#redirectGateway");
let caCertificate = $("#caCertificate");
let clientCertificate = $("#clientCertificate");
let clientKey = $("#clientKey");
let requireCertificate = $("#requireCertificate");
let certificateArea = $("#certificateArea");
let caH3 = $("#caH3");
let clientH3 = $("#clientH3");
let clientKeyH3 = $("#clientKeyH3");
let passphrase = $("#passphrase");
let passphraseh3 = $("#passhphraseH3");
let r1Destination = $("#r1-destination");
let r1Mask = $("#r1-mask");
let r1Gateway = $("#r1-gateway");

configOvpn.bind("cut copy paste", (e) => {
  e.preventDefault();
  alert("Copy and paste disabled, please click on save button to get the file");
});

//Certificados
requireCertificate.change(() => {
  if (requireCertificate.prop("checked")) {
    certificateArea.fadeIn();
  } else {
    certificateArea.fadeOut();
  }
});
var caCertificateContent = "";
var clientCertificateContent = "";
var clientKeyContent = "";
caCertificate.change(() => {
  let reader = new FileReader();
  reader.readAsText(caCertificate.prop("files")[0], "UTF-8");
  reader.onload = (event) => {
    caCertificateContent = event.target.result;
    caCertificate.siblings().first().html(caCertificate.prop("files")[0].name);
  };
  reader.onerror = () => {
    caCertificateContent = "Error while loading CA Certificate";
  };
});
clientCertificate.change(() => {
  let reader = new FileReader();
  reader.readAsText(clientCertificate.prop("files")[0], "UTF-8");
  reader.onload = (event) => {
    clientCertificateContent = event.target.result;
    clientCertificate
      .siblings()
      .first()
      .html(clientCertificate.prop("files")[0].name);
  };
  reader.onerror = () => {
    clientCertificateContent = "Error while loading Client Certificate";
  };
});
clientKey.change(() => {
  let reader = new FileReader();
  reader.readAsText(clientKey.prop("files")[0], "UTF-8");
  reader.onload = (event) => {
    clientKeyContent = event.target.result;
    clientKey.siblings().first().html(clientKey.prop("files")[0].name);
  };
  reader.onerror = () => {
    clientKeyContent = "Error while loading Client Key";
  };
});

function updateRadiosValues() {
  auth = $("input[name='auth']:checked");
  cipher = $("input[name='cipher']:checked");
}
function readCertificate(file) {
  let content = "";
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = (event) => {
    content = event.target.result;
  };
  reader.onerror = (event) => {
    content = "Error while loading CA Certificate";
  };
  return content;
}
function saveConfig() {
  if (configOvpn.val() == "") alert("Config not generated!");
  else {
    let blob = new Blob([configOvpn.val()], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "Client.ovpn");
  }
}
async function generateConfig() {
  updateRadiosValues();
  let ovpnConfig = {
    remote: remote.val(),
    port: port.val(),
    auth: auth.val(),
    cipher: cipher.val(),
    redirectGateway: redirectGateway.prop("checked"),
    requireCertificate: requireCertificate.prop("checked"),
    passphrase: passphrase.val(),
    r1Destination: r1Destination.val(),
    r1Mask: r1Mask.val(),
    r1Gateway: r1Gateway.val(),
  };
  console.log(ovpnConfig);
  if (requireCertificate.prop("checked")) {
    ovpnConfig.caCertificate = caCertificateContent;
    ovpnConfig.clientCertificate = clientCertificateContent;
    ovpnConfig.clientKey = clientKeyContent;
  }
  // console.log(ovpnConfig);

  fetch("https://api.ipify.org/?format=json").then((res) => {
    res.json().then((json) => {
      options = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          ip: json.ip,
        }),
        body: JSON.stringify(ovpnConfig),
      };
      fetch("/generateconfig", options).then((res) => {
        res.json().then((json) => {
          if (res.status == 401) {
            alert(json.message);
            window.location.href = "/user/createaccount";
          }
          if (res.status == 402) {
            alert(json.message);
            window.location.href = "/buy";
          } else if (res.status == 406) {
            alert(json.message);
          } else if (res.status == 200) {
            alert("Configuration successfully generated!");
            configOvpn.val(json.ovpnConfig);
          }
        });
      });
    });
  });
}
