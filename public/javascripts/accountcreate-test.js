var StellarSdk = require('stellar-sdk');


// create a completely new and unique pair of keys
// see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
var pair = StellarSdk.Keypair.random();


// The SDK does not have tools for creating test accounts, so you'll have to
// make your own HTTP request.
var request = require('request');
request.get({
    url: 'https://friendbot.stellar.org',
    qs: { addr: pair.publicKey() },
    json: true
}, function(error, response, body) {
    if (error || response.statusCode !== 200) {
        console.error('ERROR!', error || body);
    }
    else {
        console.log('SUCCESS! You have a new account :)\n', body);
    }
});