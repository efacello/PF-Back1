import express from "express";
import ProductManager from "../managers/product-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'asc', query = '', category = '' } = req.query;
    // Convertimos page y limit a enteros para evitar errores
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    // Construcción del filtro de búsqueda
    let filter = {};

    if (category) {
      filter.category = category; // Filtra exactamente por la categoría proporcionada
    }

    if (query) {
      filter.title = new RegExp(query, 'i'); // Filtra por título sin distinguir mayúsculas/minúsculas
    }

    // Configuración de ordenación por precio
    const sortOptions = {};
    if (sort === 'asc') {
        sortOptions.price = 1; // Ascendente
    } else if (sort === 'desc') {
        sortOptions.price = -1; // Descendente
    }

    // Obtener productos desde ProductManager con filtros, paginación y ordenación
    const productos = await productManager.getProducts({
      page: pageNum,
      limit: limitNum,
      sort: sortOptions,
      category,
      query
    });

    // Agregar imágenes a los productos
    const productosConImagen = productos.docs.map(producto => ({
      ...producto.toObject(),
      image: producto.thumbnails?.[0] || "default.jpg" // Primera imagen o una por defecto
    }));

    // Construcción dinámica de los enlaces de paginación
    const buildUrl = (pageNum) => {
      const params = new URLSearchParams({ limit, page: pageNum, sort });

      if (category) params.append("category", category);
      if (query) params.append("query", query);

      return `/api/products?${params.toString()}`;
    };

    // Respuesta con el formato solicitado
    res.json({
      status: 'success',
      payload: productosConImagen,
      totalPages: productos.totalPages,
      prevPage: productos.hasPrevPage ? productos.prevPage : null,
      nextPage: productos.hasNextPage ? productos.nextPage : null,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.hasPrevPage ? buildUrl(productos.prevPage) : null,
      nextLink: productos.hasNextPage ? buildUrl(productos.nextPage) : null,
    });

  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: 'error',
      error: "Error interno del servidor"
    });
  }
});


// solo un producto por id:
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.json({
        error: "Producto no encontrado"
      });
    }

    res.json(product);
  } catch (error) {
      console.error("Error al obtener producto", error);
      res.status(500).json({
          error: "Error interno del servidor"
      });
  }
});

// agregar nuevo producto:
router.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
    await productManager.addProduct(newProduct);
    res.status(201).json({
      message: "Producto agregado exitosamente"
    });
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

// actualizar por ID
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedProduct = req.body;

  try {
    await productManager.updateProduct(id, updatedProduct);
    res.json({
      message: "Producto actualizado exitosamente"
    });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

// eliminar producto:
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: "Producto eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

export default router;
