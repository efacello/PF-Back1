import ProductManager from "../managers/product-manager-db.js";

class ProductDAO {
    constructor() {
        this.productManager = new ProductManager();
    }

    async getProducts({ page, limit, sort, category, query }) {
        return this.productManager.getProducts({ page, limit, sort, category, query });
    }

    async getProductById(id) {
        return this.productManager.getProductById(id);
    }

    async addProduct(product) {
        return this.productManager.addProduct(product);
    }

    async updateProduct(id, updatedProduct) {
        return this.productManager.updateProduct(id, updatedProduct);
    }

    async deleteProduct(id) {
        return this.productManager.deleteProduct(id);
    }
}

export default ProductDAO;