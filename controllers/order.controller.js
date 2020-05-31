const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Payment = require('../models/payment.model');
// Stripe
const keyPublishable = process.env.PUBLISHABLE_STRIPE_KEY;
const keySecret = process.env.SECRET_STRIPE_KEY;
const stripe = require("stripe")(keySecret);
// END Stripe
const createError = require('http-errors');

module.exports.getAll = (req,res,next) => {
    const userId = req.session.user.id
    Order.find({user: userId})
        .populate('product')
        .populate('payment')
        .sort({createdAt: -1})
        .then(orders => {
            let finalOrders = []
            Cart.findOne({user: userId})
                .then(c => {
                    const cartOrders = c.order.length >= 1 ? c.order.map(o => o._id) : []
                    finalOrders = orders.filter(e => !cartOrders.includes(e.id))
                    res.json(finalOrders)
                }).catch(next)         
        })
        .catch(next)
}

module.exports.getById = (req,res,next) => {
    Order.findById(req.params.id)
        .populate('user')
        .populate('product')
        .populate('payment')
        .then(o => res.json(o))
        .catch(next)
}

module.exports.new = (req,res,next) => {
    const userId = req.session.user.id
    const order = new Order({
        user: userId,
        product: req.body.product,
        ammount: req.body.ammount,
        buyingPrice: req.body.price
    })
    order.save()
    .then(o => res.status(201).json(o))
    .catch(next)
    
}

module.exports.update = (req,res,next) => {
    Order.findByIdAndUpdate(req.body.id, req.body, {new:true})
    .then(o => res.status(201).json(o))
    .catch(next)
    
}

module.exports.delete = (req,res,next) => {
    Order.findById(req.body.id)
    .populate('payment')
    .then(o => {
       if (o.payment && !o.payment.paid) {
            o.delete().then(_ =>{
                res.status(200).json();   
            })      
       } 
    })
    .catch(next)
    
}

module.exports.purchase = (req,res,next) => {

    const orderId = req.body.order
    if (orderId) {
        Order.findById(orderId)
        .populate('product')
        .then( order => {
            const totalPrice = calculateTotal(order.ammount, order.buyingPrice)
            stripe.customers.create({
                source: req.body.stripeToken
            })
            .then(customer => {
                stripe.charges.create({
                    amount: totalPrice,
                    description: `Buying: ${order.product.name}`,
                    currency: 'eur',
                    customer: customer.id
                })
            })
            .then(_ => {
                const payment = new Payment({
                    order: req.body.order,
                    paid: true
                });
                return payment
                .save()
                .then((p) => {
                    res.status(201).json(p)
                })
            })
            .catch(console.error)
        })
    }
    
}

module.exports.cancelPurchase = (req,res,next) => {
    res.json('Working on it.')
}

const calculateTotal = (ammount, buyingPrice) => {
    return ammount * buyingPrice *100 // cents
}