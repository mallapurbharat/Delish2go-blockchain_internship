const mongo = require('./mongo');

const isRestaurant = async (req, res, next)=>{
    let res_acc_add = req.cookies.res_acc_add;

    if(res_acc_add==undefined)
        // res.status(401).send("Please unlock your wallet");
        res.redirect(`/login?url=${req.originalUrl}`)
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


const isDeliveryPersonnel = async (req, res, next)=>{
    let del_acc_add = req.cookies.del_acc_add;

    if(del_acc_add==undefined)
        // res.status(401).send("Please unlock your wallet");
        res.redirect(`/login?url=${req.originalUrl}`)
    else{
        let deliveryPersonnel  = await mongo.get(mongo.DELIVERY_PERSONNEL, { _id: del_acc_add }).toArray();

        if(deliveryPersonnel.length==0)
            res.redirect('/deliveryPersonnel/register');
        else{
            req.body.deliveryPersonnel = deliveryPersonnel[0];
            next();
        }
    }
};


const isCustomer = async (req, res, next)=>{
    let cus_acc_add = req.cookies.cus_acc_add;

    if(cus_acc_add==undefined)
        // res.status(401).send("Please unlock your wallet");
        res.redirect(`/login?url=${req.originalUrl}`)
    else{
        next();
    }
};

module.exports = {
    isRestaurant: isRestaurant,
    isDeliveryPersonnel: isDeliveryPersonnel,
    isCustomer: isCustomer
}