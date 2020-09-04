const mongo = require('./mongo');

const isRestaurant = async (req, res, next)=>{
    let res_acc_add = req.cookies.res_acc_add;

    if(!res_acc_add)
        res.status(401).send("Please unlock your wallet");
    else{
        let restaurant  = await mongo.get(mongo.RESTAURANT, { _id: res_acc_add }).toArray();

        if(restaurant.length==0)
            res.redirect('/restaurant/register');
        else{
            req.body.restaurant = restaurant[0];
            next();
        }
    }
};

module.exports = {
    isRestaurant: isRestaurant
}