const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
      },
      paid: {
        type: Boolean,
        default: false
      }
},
{
    timestamps: true,
    toJSON:{
        virtuals: true,
        transform: (db, ret) => {
            ret.id = db._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})
    
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;