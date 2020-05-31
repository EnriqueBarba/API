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
    const userId = JSON.parse(req.session.user).id
    console.info('Cart sess: ' + userId)
    Cart.findOne({user: userId})
    .populate({
        path: 'order',
        populate: {
          path: 'product',
          populate: 'owner'
        }
      })
        .then(c => {
            if (c) {
                res.status(200).json(c)
            } else {
                const cart = new Cart({
                    user: userId
                })
                console.info("Aqui cart: " + userId)
                cart.save()
                    .then(c => res.status(201).json(c))
                    .catch(next)
            }
        })
        .catch(next)
}

module.exports.add = (req,res,next) =>{
    Cart.findOne({user: JSON.parse(req.session.user).id})
        .then(c => {
            if (c) {
                const order = new Order({
                    user: JSON.parse(req.session.user).id,
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
                    user: JSON.parse(req.session.user).id,
                    product: req.body.product,
                    ammount: req.body.ammount,
                    buyingPrice: req.body.price
                })
                order.save()
                    .then(o => {
                        const cart = new Cart({
                            user: JSON.parse(req.session.user).id,
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

    Cart.findOne({user: JSON.parse(req.session.user).id})
        .then(c => {
            c.order = c.order.filter(e => e.toString() !== req.body.orderId)
            c.save()
            .then(c => {
                Order.findByIdAndDelete(req.body.orderId).then(_ => {
                    Cart.findOne({user: JSON.parse(req.session.user).id})
                    .populate({
                        path: 'order',
                        populate: {
                          path: 'product',
                          populate: 'owner'
                        }
                      })
                    .then(c => {
                        res.json(c)
                    })
                    
                })
            })
        })
        .catch(next)
}

module.exports.purchase = (req, res, next) => {
    Cart.findOne({user: JSON.parse(req.session.user).id})
        .then(c => {
            let totalAmmount = 0;
            let description = ''
            c.order.forEach( e => {
                Order.findById(e)
                .populate('product')
                .then( o => {
                    const totalPrice = calculateTotal(o.ammount, o.buyingPrice)
                    totalAmmount += totalPrice
                    description += `Product: ${o.product.name}. `

                    const payment = new Payment({
                        order: o.id,
                        paid: true
                    })
                    payment.save()
                })
            })

            stripe.customers.create({
                source: req.body.stripeToken
            })
            .then(customer => {
                stripe.charges.create({
                    amount: totalAmmount,
                    description: description,
                    currency: 'eur',
                    customer: customer.id
                })
            })

            c.order = []
            c.save()
            .then(() => res.status(201).json())
        }).catch(next)
}

const calculateTotal = (ammount, buyingPrice) => {
    return ammount * buyingPrice *100 // cents
}