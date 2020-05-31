const Product = require('../models/product.model');
const createError = require('http-errors');

module.exports.new = (req,res,next) => {
    const userId = JSON.parse(req.session.user).id
    const prod = new Product({
        owner: userId,
        name: req.body.name,
        description: req.body.description,
        images: req.files ? req.files.map(file => file.secure_url) : '',
        price: req.body.price,
        totalAmmount: req.body.totalAmmount,
        ammountLeft: req.body.ammountLeft,
        categories: req.body.categories.split(',').map(e => e),
        disabled: false
    })
    prod.save()
    .then(prod => res.status(201).json(prod))
    .catch(next)

} 

module.exports.update = (req,res,next) => {
    let prod = {}
    if (req.files.length > 0) {
        prod = {
            name: req.body.name,
            description: req.body.description,
            images: req.files.map(file => file.secure_url),
            price: req.body.price,
            totalAmmount: req.body.totalAmmount,
            ammountLeft: req.body.ammountLeft,
            categories: req.body.categories.split(',')
        }
    } else {
        prod = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            totalAmmount: req.body.totalAmmount,
            ammountLeft: req.body.ammountLeft,
            categories: req.body.categories.split(',')
        }
    }
    Product.findByIdAndUpdate(req.body.id, prod, {new:true})
        .then(prod => res.json(prod))
        .catch(next)
}

module.exports.delete = (req,res,next) => {
    
    Product.findByIdAndUpdate(req.body.id, {$set: {disabled: true}}, {new:true})
        .then(p => {
            res.status(204).json(p)
        })
        .catch(next)
}

module.exports.getAll = (req,res,next) => {
    Product.find({disabled:false})
        .sort({createdAt: -1})
        .then(prods => res.json(prods))
        .catch(next)
}

module.exports.getByFlag = (req,res,next) => {
    
    Product.findOne({flag: req.params.flag})
        .then(prod => res.json(prod))
        .catch(next)
}

module.exports.searchByCat = (req,res,next) => {
    const criteria = {};
    if (req.params.cat) {
      criteria.categories = {
        $all: req.params.cat
      }
      criteria.disabled = false
      
    }

    Product.find(criteria).sort({createdAt: -1})
        .then(prods => res.json(prods))
        .catch(next)
}

module.exports.searchByName = (req,res,next) => {

    const criteria = {};
    if (req.params.search) {
      criteria.name = {
        $regex: `${req.params.search}*`
      }
      criteria.disabled = false
    }

    Product.find(criteria).sort({createdAt: -1})
        .then(prods => {
            res.json(prods)
        })
        .catch(next)
}