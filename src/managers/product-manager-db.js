import ProductModel from "../models/product.model.js";

class ProductManager {

    //agregar nuevo producto
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.error("Todos los campos son obligatorios");
                throw new Error("Todos los campos son obligatorios");
            }
            const productExists = await ProductModel.findOne({ code: code });
            if (productExists) {
                console.error("El código de producto debe ser único");
                throw new Error("El código de producto debe ser único");
            }
            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto:", error.message);
            throw new Error('Error al agregar el producto');
        }
    }

    // obtener productos con paginación, filtro y ordenación
    async getProducts({ limit = 10, page = 1, sort = 'asc', query, category } = {}) {
        try {
            
            const skip = (page - 1) * limit;
            let queryOptions = {};
            
            // Si hay un filtro de categoría, aplícalo
            if (category) {
                queryOptions.category = new RegExp(category, 'i');  // Filtro insensible a mayúsculas/minúsculas
            }
            
            // Si hay un filtro de búsqueda (por título), aplícalo
            if (query) {
                queryOptions.title = new RegExp(query, 'i'); // Filtro por título
            }
            
            const sortOptions = {};
            
            // Verifica si el valor de sort es un objeto (como { price: 1 })
            if (typeof sort === 'object' && sort !== null) {
                if (sort.price !== undefined) {
                    sortOptions.price = sort.price;  // Aplica la ordenación por precio usando el objeto recibido
                }
            } else {
                // Lógica para manejar los valores de 'sort' si es una cadena 'asc' o 'desc'
                if (sort === 'asc') {
                    sortOptions.price = 1;  // Orden ascendente por precio
                } else if (sort === 'desc') {
                    sortOptions.price = -1; // Orden descendente por precio
                } else {
                    console.warn(`Valor de sort inválido: ${sort}. Usando el valor predeterminado 'asc'.`);
                    sortOptions.price = 1;  // Predeterminado ascendente
                }
            }
            
            // Realiza la búsqueda en la base de datos con los filtros
            const products = await ProductModel
                .find(queryOptions)   // Aplica los filtros (category y query)
                .sort(sortOptions)     // Ordenación por precio
                .skip(skip)            // Aplica la paginación
                .limit(limit);         // Limita la cantidad de productos
    

            const totalProducts = await ProductModel.countDocuments(queryOptions); // Cuenta los productos con el filtro aplicado
            const totalPages = Math.ceil(totalProducts / limit); // Calcula el número total de páginas
            
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            
            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&category=${category}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&category=${category}&query=${query}` : null,
            };
        } catch (error) {
            console.error("Error al obtener los productos:", error.message);
            throw new Error('Error al obtener los productos');
        }
    }
    

    // Obtener un producto por ID
    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                console.error("Producto no encontrado");
                return null;
            }
            return product;
        } catch (error) {
            console.error("Error al obtener el producto:", error.message);
            throw new Error('Error al obtener el producto');
        }
    }

    // Actualizar un producto por ID
    async updateProduct(id, updatedProduct) {
        try {
            const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);
            if (!updated) {
                console.error("Producto no encontrado");
                return null;
            }
            return updated;
        } catch (error) {
            console.error("Error al actualizar el producto:", error.message);
            throw new Error('Error al actualizar el producto');
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(id) {
        try {
            const deleted = await ProductModel.findByIdAndDelete(id);
            if (!deleted) {
                console.error("Producto no encontrado");
                return null;
            }
            return deleted;
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
            throw new Error('Error al eliminar el producto');
        }
    }
}

export default ProductManager;
