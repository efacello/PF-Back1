import ProductService from "../services/productService.js";

const productService = new ProductService();

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "asc",
      query = "",
      category = "",
    } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const products = await productService.getProducts({
      page: pageNum,
      limit: limitNum,
      sort,
      query,
      category,
    });

    const buildUrl = (pageNum) => {
      const params = new URLSearchParams({ limit, page: pageNum, sort });
      if (category) params.append("category", category);
      if (query) params.append("query", query);
      return `/api/products?${params.toString()}`;
    };

    res.json({
      status: "success",
      payload: products,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.prevPage : null,
      nextPage: products.hasNextPage ? products.nextPage : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? buildUrl(products.prevPage) : null,
      nextLink: products.hasNextPage ? buildUrl(products.nextPage) : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const addProduct = async (req, res) => {
  const newProduct = req.body;

  try {
    const addedProduct = await productService.addProduct(newProduct);
    res.status(201).json({
      message: "Producto agregado exitosamente",
      product: addedProduct,
    });
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.pid;
  const updatedProduct = req.body;

  try {
    const updated = await productService.updateProduct(id, updatedProduct);
    res.json({
      message: "Producto actualizado exitosamente",
      product: updated,
    });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req, res) => {
  const id = req.params.pid;

  try {
    await productService.deleteProduct(id);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
