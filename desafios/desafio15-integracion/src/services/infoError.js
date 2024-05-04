export const generateAddProductErrorInfo = (data) => {
    return `Error al agregar el producto, uno o mas campos estan incompletos o son de un tipo distinto:
      * title: String ${data.title}
      * description: String ${data.description}
      * code: String obligatorio ${data.code}
      * price: String obligatorio ${data.price}
      * status: Boolean obligatorio ${data.status}
      * stock: Number obligatorio ${data.stock}
      * category: String obligatorio ${data.category}
      * thumbnail: String no obligatorio ${data.thumbnail}`;
};

export const generateFindProductErrorInfo = (pid) => {
    return `No se pudo encontrar el producto
    El id del producto es: ${pid}`;
};