const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const Payment = require('../models/payment.model');
// Stripe
const keyPublishable = process.env.PUBLISHABLE_STRIPE_KEY;
const keySecret = process.env.SECRET_STRIPE_KEY;
const stripe = require("stripe")(keySecret);
// END Stripe
const createError = require('http-errors');

module.exports.get = (req,res,next) =>{
    
    Cart.findOne({user: req.session.user.id})
        .populate('order')
        .then(c => {
            if (c) {
                res.status(201).json(c)
            } else {
                const cart = new Cart({
                    user: req.session.user.id
                })
                cart.save()
                    .then(c => res.status(201).json(c))
                    .catch(next)
            }
        })
        .catch(next)
}

module.exports.add = (req,res,next) =>{
    Cart.findOne({user: req.session.user.id})
        .then(c => {
            if (c) {
                const order = new Order({
                    user: req.session.user.id,
                    product: req.body.product,
                    ammount: req.body.ammount,
                    buyingPrice: req.body.price
                })
                order.save()
                    .then(o => {
                        c.order = [...c.order, o.id]
                        c.save()
                            .then(c => res.status(201).json(c))
                            .catch(next)
                    })
                    .catch(next)
            } else {
                const order = new Order({
                    user: req.session.user.id,
                    product: req.body.product,
                    ammount: req.body.ammount,
                    buyingPrice: req.body.price
                })
                order.save()
                    .then(o => {
                        const cart = new Cart({
                            user: req.session.user.id,
                            order: [o.id]
                        })
                    cart.save()
                        .then(c => res.status(201).json(c))
                        .catch(next)
                    })
                    .catch(next)
            }
        })
        .catch(next)
}

module.exports.update = (req,res,next) => {
    Cart.findByIdAndUpdate(req.body.id, req.body, {new:true})
        .populate('order')
        .then(c => res.json(c))
        .catch(next)
}

module.exports.purchase = (req, res, next) => {
    Cart.findOne({user: req.session.user.id})
        .then(c => {
            Promise.all(c.order).then(o =>{
                const payment = new Payment({
                    order: o
                })
                payment.save()
                }
            )
            c.order = []
            c.save()
        })
        .then(() => res.status(201).json())
        .catch(next)
}