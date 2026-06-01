function getStock() {
    return JSON.parse(localStorage.getItem(`all-stock`)) || [];
}

/* display cart */
function displayCart() {
    const cartDiv = document.querySelector(`.cart-items-div`);
    if (!cartDiv) return;
    let cart = JSON.parse(localStorage.getItem(`cart`)) || [];
    let stock = getStock();
    cartDiv.innerHTML = ``;
    let total = 0;

    cart.forEach((cartItem) => {
        const product = stock.find((p) => p.id === cartItem.id);
        if (!product) return;
        const subtotal = product.price * cartItem.quantity;
        total += subtotal;

        const div = document.createElement(`div`);
        div.innerHTML = `
            <p>${product.name}</p>
            <p>€${product.price}</p>
            <button onclick="changeQuantity(${product.id}, -1)">-</button>
            <span>${cartItem.quantity}</span>
            <button onclick="changeQuantity(${product.id}, 1)">+</button>
            <p>€${subtotal.toFixed(2)}</p>
            <button onclick="removeItem(${product.id})">Remove</button>
        `;
        cartDiv.appendChild(div);
    });

    const totalDiv = document.createElement(`h2`);
    totalDiv.innerText = `Total: €` + total.toFixed(2);
    cartDiv.appendChild(totalDiv);
}

displayCart();

/* change quantity */
function changeQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem(`cart`)) || [];
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
    localStorage.setItem(`cart`, JSON.stringify(cart));
    displayCart();
}

/* remove cart item */
function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem(`cart`)) || [];
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem(`cart`, JSON.stringify(cart));
    displayCart();
}

/* order button */
const orderButton = document.querySelector(`.order-button`);

if (orderButton) {
    orderButton.addEventListener(`click`, () => {
        let cart = JSON.parse(localStorage.getItem(`cart`));
        if (cart && cart.length > 0) {
            let allOrders = JSON.parse(localStorage.getItem(`Order`)) || [];
            allOrders.push(cart);
            localStorage.setItem(`Order`, JSON.stringify(allOrders));
            localStorage.removeItem(`cart`);
            window.location.href = `ordered.html`;
        } else {
            orderButton.textContent = `Cart is empty!`;
            let cartEmptyAudio = new Audio(`/sounds/error.mp3`);
            cartEmptyAudio.play();
        }
    });
}
