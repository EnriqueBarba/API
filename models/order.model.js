const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    ammount: {
        type: Number, 
        required:true,
        default: 1,
        min: 1
    },
    buyingPrice: {
        type: Number, 
        required:true,
        min: 0
    }
    /*
    paid: boolean
    */
},
{
    timestamps:true,
    toJSON:{
        virtuals:true,
        transform: (db, ret) => {
            ret.id = db._id;
            delete ret._id;
            delete ret.__v;
            return ret;
          }
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;