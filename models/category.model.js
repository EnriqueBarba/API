const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    }
},
{
    timestamps:true,
    toJSON:{
        virtuals: true,
        transform: (db, ret) => {
            ret.id = db._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updateddAt;
            return ret;
        }
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;