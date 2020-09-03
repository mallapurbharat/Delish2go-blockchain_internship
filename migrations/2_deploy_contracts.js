var DlishToken = artifacts.require("DlishToken");
var DlishBlockchain = artifacts.require("DlishBlockchain");

module.exports = function(deployer) {
  deployer.deploy(DlishToken).then(_=>{
    return deployer.deploy(DlishBlockchain, DlishToken.address);
  });
  
};