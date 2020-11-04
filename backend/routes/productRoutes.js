import express from 'express'
import { getProducts, getProductById, deleteProduct, updateProduct, createProduct, reviewProduct } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, reviewProduct)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)




export default router