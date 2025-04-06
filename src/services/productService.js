import ProductRepository from "../repositories/productRepository.js";
import ProductDTO from "../dto/product.dto.js";

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getProducts(options) {
        const products = await this.productRepository.getProducts(options);
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await this.productRepository.getProductById(id);
        return product ? new ProductDTO(product) : null;
    }

    async addProduct(product) {
        const newProduct = await this.productRepository.addProduct(product);
        return new ProductDTO(newProduct);
    }

    async updateProduct(id, updatedProduct) {
        const updated = await this.productRepository.updateProduct(id, updatedProduct);
        return updated ? new ProductDTO(updated) : null;
    }

    async deleteProduct(id) {
        await this.productRepository.deleteProduct(id);
    }
}

export default ProductService;
