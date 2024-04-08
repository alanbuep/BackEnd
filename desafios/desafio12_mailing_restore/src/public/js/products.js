document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async event => {
        const productId = event.target.dataset.productId;
        const cartIdInput = event.target.previousElementSibling;
        const cartId = cartIdInput.value;

        try {
            console.log(cartId)
            console.log(productId)
            const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto al carrito');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    });
});

const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout');
    if (response.ok) {
        window.location.href = '/login';
    } else {
        alert('Error al cerrar sesión');
    }
});

const restorePasswordButton = document.getElementById('restore-password-button');
restorePasswordButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8080/restorepasswordemail', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Error al solicitar restablecimiento de contraseña');
        }
        if (response.ok) {
            alert('Correo enviado correctamente');
        };
    } catch (error) {
        console.error(error);
    }
});