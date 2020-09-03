pragma solidity ^0.6.0;

contract Restaurant {

    struct restaurant {
        string name;
    }
    mapping(address=>restaurant) restaurants;
    address[] restaurantAcc;

    // event TestEvent(string[] names);
    

    function addRestaurant(string memory _name) public returns (bool success) {
        require(keccak256(bytes(restaurants[msg.sender].name))==keccak256(""));
        
        restaurant memory res = restaurants[msg.sender];
        res.name = _name;
        restaurants[msg.sender]=res;
        
        restaurantAcc.push(msg.sender);
        
        return true;
    }
    
    function getRestaurants() public view returns(address[] memory add){
        return restaurantAcc;
    }

    // function getRestaurantNames() public view {
    //     string[uint(restaurantAcc.length)] memory names;
    //     for (uint index = 0; index < restaurantAcc.length; index++) {
    //         names[index]=restaurants[restaurantAcc[index]].name;
    //     }
        
    // }
}
