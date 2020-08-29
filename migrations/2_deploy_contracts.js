var Restaurant = artifacts.require("Restaurant");
var DlishBlockchain = artifacts.require("DlishBlockchain");

module.exports = function(deployer) {
  deployer.deploy(Restaurant);
  deployer.deploy(DlishBlockchain);
};