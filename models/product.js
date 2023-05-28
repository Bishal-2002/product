const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isFeatured: Boolean,
    rating: Number,
    date: {
        type: Date,
        required: true
    },
    company: {
        type: String,
        required: true
    }
})
const Product=mongoose.model('Product',productSchema)
module.exports=Product