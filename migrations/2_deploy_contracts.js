var Restaurant = artifacts.require("Restaurant");

module.exports = function(deployer) {
  deployer.deploy(Restaurant);
};