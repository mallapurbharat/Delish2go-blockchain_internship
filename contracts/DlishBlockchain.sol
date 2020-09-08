pragma solidity ^0.6.0;


import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract DlishBlockchain {
    
    struct Order {
        address Customer;
        address Restaurant;
        address DeliveryPerson;
        string dishid_quantity;
        uint Price;
        // string[] DishidList;
    }
    
    uint orderid;
    
    IERC20 private d2gToken;
    
    mapping (uint => Order) public orders;
    
    mapping (address => bool) public restaurant;
    address[] RestauratsList;
    
    mapping (address => bool) public deliveryperson;
    address[] DeliveryPersonList;
    
//#################### modifiers ###########################
    
    modifier isNotRestaurant(){
        require(restaurant[msg.sender] == false, "You have already been registered as Restaurant");
        _;
    }
    
    modifier isRestaurant(address _account){
        require(restaurant[_account], "Invalid restaurant address");
        _;
    }
    
    modifier isPaid(uint _amount){
        require(_amount>0, "Invalid price");
        require(d2gToken.transferFrom(msg.sender, address(this), _amount), "Transaction Failed");
        _;
    }
    
    modifier isValidOrder(uint _orderId){
        require(_orderId<=orderid, "Invalid order ID");
        _;
    }
    
    modifier isNotDeliveryPerson(){
        require(deliveryperson[msg.sender] == false, "You already been registered as Delivery Person");
        _;
    }
    
    modifier isDeliveryPerson(){
        require(deliveryperson[msg.sender], "You have not been registered as Delivery Person");
        _;
    }
    
    modifier isValidDeliveryPersonForTheOrderId(uint _orderId){
        require(msg.sender == orders[_orderId].DeliveryPerson, "You were not assigned as delivery person to this order");
        _;
    }
    
    modifier isValidCustomerForTheOrderId(uint _orderId){
        require(msg.sender == orders[_orderId].Customer, "You were not the customer for this order");
        _;
    }
    
    
//#################### constructor ############################
    
    constructor (address _d2gTokenAddress) public {
        d2gToken = IERC20(_d2gTokenAddress);
    }
    
//################### Functions ############################
    
    function RegisterRestaurant() public isNotRestaurant isNotDeliveryPerson{
        restaurant[msg.sender] = true;
        RestauratsList.push(msg.sender);
    }
    
    function RegisterDeliveryPerson() public isNotDeliveryPerson isNotRestaurant{
        deliveryperson[msg.sender] = true;
        DeliveryPersonList.push(msg.sender);
    }
    
    function PlaceOrder(address _restaurantaddress, uint _amount, string memory _dishid_quantity) public isPaid(_amount) isRestaurant(_restaurantaddress){
        orderid++;
        orders[orderid].Customer = msg.sender;
        orders[orderid].Restaurant = _restaurantaddress;
        orders[orderid].Price = _amount;
        orders[orderid].dishid_quantity = _dishid_quantity;
    }
    
    // function AddDish(uint _orderId, string memory _dishid, uint _quantity) public isValidOrder(_orderId){
    //     orders[_orderId].dishid_quantity[_dishid] = _quantity;
    //     orders[_orderId].DishidList.push(_dishid);
    // } 
    
    function AcceptOrder(uint _orderId) public isValidOrder(_orderId) isDeliveryPerson{
       orders[_orderId].DeliveryPerson = msg.sender; 
    }
    
    function OutForDelivery(uint _orderId) public isDeliveryPerson isValidDeliveryPersonForTheOrderId(_orderId){
        uint amount = orders[_orderId].Price;
        uint resamount = (amount - 20) * 99/100 ;
        address resaddress = orders[_orderId].Restaurant;
        d2gToken.transfer(resaddress, resamount );
    }
    
    function received(uint _orderId) public isValidCustomerForTheOrderId(_orderId){
        address deladdress = orders[_orderId].DeliveryPerson;
        d2gToken.transfer(deladdress, 20 );
    }
    
}