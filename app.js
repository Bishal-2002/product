const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const Product=require('./models/product')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const ExpressError=require('./utils/ExpressError')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/productDb');
}

app.engine('ejs', ejsMate)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.get('/products', async(req,res)=>{
    const products=await Product.find({})
    res.render('products/index',{products})
})

app.get('/products/new', (req,res)=>{
    res.render('products/new')
})

app.post('/products',async(req,res)=>{
    const newProduct=new Product(req.body.product)
    newProduct.date=new Date()
    console.log(newProduct)
    await newProduct.save()
    res.redirect('/products')
})

app.get('/products/filter', async(req,res)=>{
    const price=req.query['price-filter']
    const rating=req.query['rating-filter']
    const products=await Product.find();
    console.log(req.originalUrl)
    res.render('products/filter', {price, rating, products})
})

app.get('/products/featured', async(req,res)=>{
    const products=await Product.find({})
    res.render('products/featured', {products})
})

app.get('/products/:id',async(req,res)=>{
    const {id}=req.params
    const product=await Product.findById(id)
    res.render('products/details',{product})
})

app.get('/products/:id/edit', async(req,res) => {
    const {id}=req.params
    const product=await Product.findById(id)
    res.render('products/edit', {product})
})

app.put('/products/:id',async(req,res)=>{
    const {id}=req.params
    req.body.product.date=new Date()
    const product=await Product.findByIdAndUpdate(id, req.body.product);
    res.redirect(`/products/${id}`)
})

app.delete('/products/:id', async(req,res)=>{
    const {id}=req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
})

app.listen(8080, ()=>{
    console.log("Listening on Port 8080")
})