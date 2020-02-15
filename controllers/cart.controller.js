const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
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
                c.order = [...c.order, req.body.order]
                c.save()
                .then(c => res.status(201).json(c))
                .catch(next)
                /*Cart.findByIdAndUpdate(c.id, {order: req.body.order}, {new:true})
                    .then(c => res.status(201).json(c))
                    .catch(next)*/
                
            } else {
                const cart = new Cart({
                    user: req.session.user.id,
                    order: [req.body.order]
                })
                cart.save()
                    .then(c => res.status(201).json(c))
                    .catch(next)
            }
        })
        .catch(next)
}

module.exports.update = (req,res,next) => {
    Cart.findByIdAndUpdate(req.body.id, req.body, {new:true})
        .then(c => res.json(c))
        .catch(next)
}