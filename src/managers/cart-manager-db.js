    import mongoose from 'mongoose';
    import CartModel from "../models/cart.model.js";

    class CartManager {
        // Crear un nuevo carrito
        async createCart() {
            try {
                const newCart = new CartModel({ products: [] });
                await newCart.save();
                return newCart;
            } catch (error) {
                console.log("Error al crear el carrito:", error.message);
                throw new Error('Error al crear el carrito');
            }
        }

        // Obtener un carrito por ID
        async getCartById(cartId) {
            try {
                // Usamos populate para obtener los datos completos del producto
                const cart = await CartModel.findById(cartId).populate("products.product");  
                if (!cart) {
                    console.log("Carrito no encontrado");
                    return null;
                }
                return cart;
            } catch (error) {
                console.error("Error al obtener el carrito:", error.message);
                throw new Error('Error al obtener el carrito');
            }
        }

        // Agregar un producto al carrito
        async addProductToCart(cartId, productId, quantity = 1) {
            try {
                // Asegurarse de que el productId es un ObjectId válido
                if (!mongoose.Types.ObjectId.isValid(productId)) {
                    throw new Error('El ID del producto no es válido');
                }

                const cart = await this.getCartById(cartId);
                if (!cart) {
                    throw new Error('Carrito no encontrado');
                }

                // Verificar si el producto ya está en el carrito
                const productExists = cart.products.find(item => 
                    item.product.toString() === productId // Convertimos item.product a string para la comparación
                );

                if (productExists) {
                    // Si el producto ya existe en el carrito, solo se actualiza la cantidad
                    productExists.quantity += quantity;
                } else {
                    // Si no está en el carrito, lo agregamos
                    cart.products.push({ product: productId, quantity });
                }

                // Asegurarse de que Mongoose detecte cambios en el array
                cart.markModified('products');
                await cart.save();
                return cart;
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error.message);
                throw new Error('Error al agregar producto al carrito');
            }
        }

        // Eliminar un producto del carrito
        async removeProductFromCart(cartId, productId) {
            try {
                const cart = await CartModel.findById(cartId);
                if (!cart) {
                    throw new Error('Carrito no encontrado');
                }
                cart.products = cart.products.filter(item => 
                    item.product._id.toString() !== productId
                );
                // Asegurarse de que Mongoose detecte cambios en el array
                cart.markModified('products');
                await cart.save();
                return cart;
            } catch (error) {
                console.error("Error al eliminar producto del carrito:", error.message);
                throw new Error('Error al eliminar producto del carrito');
            }
        }

        // Actualizar el carrito con una lista de productos nueva
        async updateCart(cartId, updatedProducts) {
            try {
                const cart = await CartModel.findById(cartId);
                if (!cart) {
                    throw new Error('Carrito no encontrado');
                }
                cart.products = updatedProducts;
                cart.markModified('products');
                await cart.save();
                return cart;
            } catch (error) {
                console.error("Error al actualizar el carrito:", error.message);
                throw new Error('Error al actualizar el carrito');
            }
        }

        // Actualizar la cantidad de un producto en el carrito
        async updateProductQuantity(cartId, productId, newQuantity) {
            try {
                const cart = await CartModel.findById(cartId);
                if (!cart) {
                    throw new Error('Carrito no encontrado');
                }
                const productIndex = cart.products.findIndex(item => 
                    item.product._id.toString() === productId
                );
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = newQuantity;
                    cart.markModified('products');
                    await cart.save();
                    return cart;
                } else {
                    throw new Error('Producto no encontrado en el carrito');
                }
            } catch (error) {
                console.error("Error al actualizar cantidad de producto:", error.message);
                throw new Error('Error al actualizar cantidad de producto');
            }
        }

        // Vaciar el carrito
        async clearCart(cartId) {
            try {
                const cart = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
                if (!cart) {
                    throw new Error('Carrito no encontrado');
                }
                return cart;
            } catch (error) {
                console.error("Error al vaciar el carrito:", error.message);
                throw new Error('Error al vaciar el carrito');
            }
        }
    }

    export default CartManager;
