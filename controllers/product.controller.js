const Product = require('../models/product.model');
const createError = require('http-errors');

module.exports.new = (req,res,next) => {

    const prod = new Product({
        owner: req.session.user.id,
        name: req.body.name,
        images: req.files ? req.files.map(file => file.secure_url) : '',
        price: req.body.price,
        totalAmmount: req.body.totalAmmount,
        ammountLeft: req.body.ammountLeft,
        categories: req.body.categories
    })
    prod.save()
    .then(prod => res.status(201).json(prod))
    .catch(next)

} 

module.exports.update = (req,res,next) => {
    const prod = {
        name: req.body.name,
        images: req.files ? req.files.map(file => file.secure_url) : '',
        price: req.body.price,
        totalAmmount: req.body.totalAmmount,
        ammountLeft: req.body.ammountLeft,
        categories: req.body.categories
    }

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
    Product.find({})
        .then(prods => res.json(prods))
        .catch(next)
}

module.exports.searchByCat = (req,res,next) => {
    
    const criteria = {};
    if (req.params.cat) {
      criteria.categories = {
        $all: req.params.cat.split(',')
      }
    }

    Product.find(criteria)
        .then(prods => res.json(prods))
        .catch(next)

}