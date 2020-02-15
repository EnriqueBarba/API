const Order = require('../models/order.model');
const createError = require('http-errors');

module.exports.getAll = (req,res,next) => {
    Order.find({user: req.session.user.id})
        .then(orders => res.json(orders))
        .catch(next)
}

module.exports.getById = (req,res,next) => {
    Order.findById(req.params.id)
        .then(o => res.json(o))
        .catch(next)
}

module.exports.new = (req,res,next) => {
    const order = new Order({
        user: req.session.user.id,
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