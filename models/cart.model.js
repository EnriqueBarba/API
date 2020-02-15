const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        unique: true,
        required:true
    },
    order:{
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
        default: []
    }
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

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;