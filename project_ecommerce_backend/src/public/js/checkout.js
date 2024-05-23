const mp = new MercadoPago('TEST-2cac8fc2-06c3-4566-83c1-d6fa4d6365ee', {
    locale: 'es-AR'
});

const cartId = window.location.pathname.split("/")[2];

document.getElementById("checkout-button").addEventListener("click", async function () {

    try {
        let total = 0;

        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/purchase`, {
            method: "GET",
        });
        const result = await response.json();
        if (response.ok) {
            total = result.total;
        } else {
            alert(result.message);
        }

        const orderData = {
            title: "Tienda-Gamer",
            quantity: 1,
            price: total,
            cartId: cartId,
        };

        const responseMP = await fetch(`http://localhost:8080/api/carts/create-preference`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const preference = await responseMP.json();

        createCheckoutButton(preference.id);
    } catch (error) {
        alert("Error:", error)
    }

});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        if (window.checkoutButton) window.checkoutButton.unmount();

        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    }

    renderComponent();
}