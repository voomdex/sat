var abi;
var address;

$.getJSON('assets/js/uns.json', function(data){
  address = data.caddress;
  abi = data.cabi;
});

var urlParams;
(window.onpopstate = function () {
  var match,
  pl     = /\+/g,  // Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g,
  decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
  query  = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
  urlParams[decode(match[1])] = decode(match[2]);
})();

if(urlParams.ref === undefined) {
  urlParams.ref = "0x0000000000000000000000000000000000000000";
}

var refer = urlParams.ref;


async function getAirdrop(){
  var modal = document.getElementById("myModal");

  if (typeof(web3) === 'undefined') {
    document.getElementById("popmsg").innerHTML = "Unable to find web3. Please run MetaMask (or something else that injects web3)";
      modal.style.display = "inline-block";
  }
  else{
    if (web3.version.network != 4) {
      document.getElementById("popmsg").innerHTML ="Wrong network detected. Please switch to the Ethereum Rinkeby Network";
        modal.style.display = "inline-block";
    }
    else {
      if (web3.currentProvider.isMetaMask) {
        let x = await ethereum.enable();
      }
      sendmessage();

      function sendmessage(){
        var myContract = web3.eth.contract(abi).at(address);
        myContract.getAirdrop.estimateGas(refer, {from: ethereum.selectedAddress}, function(err, result) {
          if(!err){
            var _gas = result + 999;
            myContract.getAirdrop(refer, {from: ethereum.selectedAddress, gas: _gas}, function(err, result) {
              if(!err){
                document.getElementById("popmsg").innerHTML = "400 UNS Sent to your wallet Tx Hash: "+result;
                modal.style.display = "inline-block";
                console.log(result);
              }
              else
              console.error(err);
            });
          }
          else
          console.error(err);
        });
      }
    }
  }
}
