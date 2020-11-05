import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'




// @desc Fetch all products
// @route GET /api/products
// @access Public

const getProducts = asyncHandler(async (req, res) => {

    //regex to include any letter (not just the full word ) to search for items
    //options 'i' is to make the search case insensitive

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const products = await Product.find({ ...keyword })

    res.json(products)

})


// @desc Fetch single
// @route GET /api/products/:id
// @access Public

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }

})


// @desc DELETE product
// @route DELETE /api/products/:id
// @access Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
    //find product first
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({ message: 'Product Deleted' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }

})

// @desc Create product
// @route POST /api/products/
// @access Private/Admin

const createProduct = asyncHandler(async (req, res) => {

    const product = new Product({
        name: 'Sample',
        price: 0,
        user: req.user._id,
        image: '/images/sample/jpg',
        brand: 'sample brand',
        category: 'sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)

})

// @desc update product
// @route PUT /api/products/:id
// @access Private/Admin

const updateProduct = asyncHandler(async (req, res) => {

    const { name, price, description, image, brand, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updateProduct).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error(
            'product not found'
        )
    }


})

// @desc Create product review
// @route POST /api/products/:id/reviews
// @access Private

const reviewProduct = asyncHandler(async (req, res) => {

    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('User can only review once per product')

        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }


        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review Added' })
    } else {
        res.status(404)
        throw new Error(
            'Product Not Found'
        )
    }


})

export { getProducts, getProductById, deleteProduct, updateProduct, createProduct, reviewProduct }