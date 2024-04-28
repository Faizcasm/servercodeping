import Stripe from "stripe";
import {v4 as uuidv4} from 'uuid'
const stripe = Stripe("sk_test_51OgMFHSIQTzOyhReSrWxTCxaBX0jezGzv91trSZh6NjEG70IwbQxhp9WYl40vaAakvTShtyWBDDs7LOXnojkIe7400iGKdenj8")
const payment = async(req,res)=>{
    try {
        const {amount,token}=req.body
        console.log("product :",amount);
        console.log("product price :",token);
        const idempotencyKey =uuidv4()
    
        return stripe.customers.create({
            email: token.email,
            source : token.id,
        }).then(customer=>{
            stripe.paymentIntents.create({
                amount :amount*100,
                currency :'inr',
                customer:customer.id,
                receipt_email:token.email,
                description :"purchase of product.name"
            },{idempotencyKey})
        }).then(result=>{
            return res.status(200).json(result)
            
        }).catch(err=>{
            console.log("error",err);
            return res.status(400)
        })
    } catch (error) {
        console.log(error);
        return res.status(401)
    }
   
}
export default payment
