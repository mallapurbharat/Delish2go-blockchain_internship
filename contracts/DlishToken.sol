pragma solidity ^0.6.0;
 
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
 
contract DlishToken is ERC20 {
    constructor() ERC20("DlishToken", "D2G") public {
        _mint(msg.sender, 21000000);
        _setupDecimals(0);
    }
}