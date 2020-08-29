pragma solidity ^0.5.12;

contract DlishBlockchain {
    
    struct Order {
        address Customer;
        address Restaurant;
        address DeliveryPerson;
        mapping (uint => uint) dishid_quantity;
        uint[] DishidList;
    }
    
    uint orderid;
    
    mapping (uint => Order) orders;
    
    mapping (address => bool) public restaurant;
    address[] RestauratsList;
    
    modifier isRegistered(){
        require(restaurant[msg.sender] == false, "You have already been registered as Restaurant");
        _;
    }
    
    function RegisterRestaurant() public isRegistered{
        restaurant[msg.sender] = true;
        RestauratsList.push(msg.sender);
    }
    
    function PlaceOrder(address _customeraddress, address _restaurantaddress) public{
        orderid++;
        orders[orderid].Customer = _customeraddress;
        orders[orderid].Restaurant = _restaurantaddress;
    }
    
    function AddDish(uint _dishid, uint _quantity) public {
        orders[orderid].dishid_quantity[_dishid] = _quantity;
        orders[orderid].DishidList.push(_dishid);
    } 
    
    function AcceptOrder() public {
       orders[orderid].DeliveryPerson = msg.sender; 
    }
    
    // function getOrdersDetails(uint _orderid) public view returns(address , address , address , uint[] memory) {
    //     return(orders[_orderid].Customer, orders[_orderid].Restaurant, orders[_orderid].DeliveryPerson, orders[_orderid].DishidList);
    // }
    
}