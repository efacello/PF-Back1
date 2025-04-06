import ProductDAO from "../dao/productDao.js";

class ProductRepository {
    constructor() {
        this.productDAO = new ProductDAO();
    }

    async getProducts(options) {
        return this.productDAO.getProducts(options);
    }

    async getProductById(id) {
        return this.productDAO.getProductById(id);
    }

    async addProduct(product) {
        return this.productDAO.addProduct(product);
    }

    async updateProduct(id, updatedProduct) {
        return this.productDAO.updateProduct(id, updatedProduct);
    }

    async deleteProduct(id) {
        return this.productDAO.deleteProduct(id);
    }
}

export default ProductRepository;