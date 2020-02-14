const mongoose = require('mongoose');
const CATEGORIES = require('../data/categories')

const productSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name needs at last 3 characters'],
        trim: true},
    flag: {
        type: String
        },
    images: {
        type: [String],
        required: [true, 'At least one image is required']
        },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0, 
        },
    totalAmmount: {
        type:Number, 
        required:true, 
        min: 0
        },
    ammountLeft: {
        type:Number, 
        min: 0
        },
    categories: {
        type: [String],
        enum: CATEGORIES.map(e => e.name),
        default: []
    }
},
{
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (db, ret) => {
        ret.id = db._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        return ret;
      }
    }
})

productSchema.pre('save', function (next) {
    const product = this;
    
    if (product.isModified('name')) {  
      product.flag = this.generateFlag(product.name);
      next();
    }
  });

productSchema.methods.generateFlag = function (name) {
    return name.replace(/[^A-Z0-9]/ig, "_") + Math.random().toString(36).substr(2,9);
}

const Product = mongoose.model('Product', productSchema);

module.exports = Product;