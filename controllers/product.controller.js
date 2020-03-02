const Product = require('../models/product.model');
const createError = require('http-errors');

module.exports.new = (req,res,next) => {

    const prod = new Product({
        owner: req.session.user.id,
        name: req.body.name,
        description: req.body.description,
        images: req.files ? req.files.map(file => file.secure_url) : '',
        price: req.body.price,
        totalAmmount: req.body.totalAmmount,
        ammountLeft: req.body.ammountLeft,
        categories: req.body.categories.split(',').map(e => e)
    })
    prod.save()
    .then(prod => res.status(201).json(prod))
    .catch(next)

} 

module.exports.update = (req,res,next) => {
    console.info(req.body)
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
    console.info('Prod ', prod)
    Product.findByIdAndUpdate(req.body.id, prod, {new:true})
        .then(prod => res.json(prod))
        .catch(next)
}

module.exports.delete = (req,res,next) => {
    console.info(req.body.owner)
    if ( req.body.owner === req.session.user.id ) {
        Product.findByIdAndDelete(req.body.id)
            .then(() => res.status(204).json())
            .catch(next)
    } else {
        res.status(401).json()
    }
}

module.exports.getAll = (req,res,next) => {
    Product.find({}).sort({createdAt: -1})
        .then(prods => res.json(prods))
        .catch(next)
}

module.exports.getByFlag = (req,res,next) => {
    
    Product.findOne({flag: req.params.flag})
        .then(prod => console.info(prod) || res.json(prod))
        .catch(next)
}

module.exports.searchByCat = (req,res,next) => {
    console.info(req.params.cat)
    const criteria = {};
    if (req.params.cat) {
      criteria.categories = {
        $all: req.params.cat
      }
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
    }

    Product.find(criteria).sort({createdAt: -1})
        .then(prods => {
            res.json(prods)
        })
        .catch(next)
}