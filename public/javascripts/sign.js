

var StellarSdk = require('stellar-sdk');



var sourceSecretKey = process.argv[3];
var receiverPublicKey = process.argv[5];
var host = process.argv[7];
var amount = process.argv[9];
var tag = process.argv[11];

// var sourceSecretKey = 'SAKRB7EE6H23EF733WFU76RPIYOPEWVOMBBUXDQYQ3OF4NF6ZY6B6VLW';
// var receiverPublicKey = 'GAIRISXKPLOWZBMFRPU5XRGUUX3VMA3ZEWKBM5MSNRU3CHV6P4PYZ74D';
// var host = 'https://horizon-testnet.stellar.org';
// var amount = 10;
// var tag = 1234567890;



// Derive Keypair object and public key (that starts with a G) from the secret
var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
var sourcePublicKey = sourceKeypair.publicKey();

// Configure StellarSdk to talk to the horizon instance hosted by Stellar.org
// To use the live network, set the hostname to 'horizon.stellar.org'
var server = new StellarSdk.Server(host, {allowHttp: true});




// Uncomment the following line to build transactions for the live network. Be
// sure to also change the horizon hostname.
// StellarSdk.Network.usePublicNetwork();
StellarSdk.Network.useTestNetwork();

// Transactions require a valid sequence number that is specific to this account.
// We can fetch the current sequence number for the source account from Horizon.
server.loadAccount(sourcePublicKey)
    .then(function(account) {
        var transaction = new StellarSdk.TransactionBuilder(account)
        // Add a payment operation to the transaction
            .addOperation(StellarSdk.Operation.payment({
                destination: receiverPublicKey,
                // The term native asset refers to lumens
                asset: StellarSdk.Asset.native(),
                // Specify 350.1234567 lumens. Lumens are divisible to seven digits past
                // the decimal. They are represented in JS Stellar SDK in string format
                // to avoid errors from the use of the JavaScript Number data structure.
                amount: amount.toString(),
            }))
            // Uncomment to add a memo (https://www.stellar.org/developers/learn/concepts/transactions.html)
            .addMemo(StellarSdk.Memo.id(tag.toString()))
            .build();

        // Sign this transaction with the secret key
        // NOTE: signing is transaction is network specific. Test network transactions
        // won't work in the public network. To switch networks, use the Network object
        // as explained above (look for StellarSdk.Network).
        transaction.sign(sourceKeypair);

        // Let's see the XDR (encoded in base64) of the transaction we just built
        console.log(transaction.toEnvelope().toXDR('base64'));

        // Submit the transaction to the Horizon server. The Horizon server will then
        // submit the transaction into the network for us.
        // server.submitTransaction(transaction)
        //     .then(function(transactionResult) {
        //         console.log(JSON.stringify(transactionResult, null, 2));
        //         console.log('\nSuccess! View the transaction at: ');
        //         console.log(transactionResult._links.transaction.href);
        //     })
        //     .catch(function(err) {
        //         console.log('An error has occured:');
        //         console.log(err);
        //     });
    })
    .catch(function(e) {
        console.error(e);
    });