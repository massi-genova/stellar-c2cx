

var StellarSdk = require('stellar-sdk');


// create a completely new and unique pair of keys
// see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
var pair = StellarSdk.Keypair.random();




console.log(pair.secret());
console.log(pair.publicKey());