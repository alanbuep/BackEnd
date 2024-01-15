const socket = io();
console.log("Bienvenido a Tienda Gamer");

const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");

addProductBtn.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const status = document.getElementById("status").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const thumbnail = document.getElementById("thumbnail").value;

    const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
    };

    socket.emit("addProduct", product);
    title.value = "";
    description.value = "";
    code.value = "";
    price.value = "";
    status.value = "";
    stock.value = "";
    category.value = "";
    thumbnail.value = "";
});

deleteProductBtn.addEventListener("click", () => {
    const id = document.getElementById("productId").value;
    console.log(id);
    socket.emit("deleteProduct", id);
    id.value = "";
    alert("Producto eliminado");
});

socket.on("updateProducts", (products) => {
    const newCard = document.createElement("div")
    newCard.className = "card container"
    newCard.innerHTML = `
    <div class="card container">
    <img class="card-img-top img-card" src="${this.thumbnail}" alt="${this.name}" />
    <div class="card-body text-card">
        <h5 class="card-title">${this.title}</h5>
        <p class="card-text">${this.description}</p>
        <p class="card-text"><strong>Precio: $${this.price}</strong></p>
        <p class="card-text">Stock: ${this.stock}</p>
        <p class="card-text">Code: ${this.code}</p>
        <p class="card-text">ID: ${this._id}</p>
    </div>
</div>
    `
});