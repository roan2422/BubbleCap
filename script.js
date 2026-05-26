/* stock into localstorage */
fetch(`stock.json`)
    .then((res) => res.json())
    .then((data) => {
        if (!localStorage.getItem(`all-stock`)) {
            localStorage.setItem(`all-stock`, JSON.stringify(data.stock));
        }
    });

function getStock() {
    return JSON.parse(localStorage.getItem(`all-stock`)) || [];
}

function saveStock(stock) {
    localStorage.setItem(`all-stock`, JSON.stringify(stock));
}

/* cart sound */
let addToCartAudio = new Audio(`sounds/kashing.mp3`);

/* cart listeners */
function addCartListeners() {
    document.querySelectorAll(`.cart-adding-button`).forEach((button) => {
        button.addEventListener(`click`, addToCart);
        button.addEventListener(`click`, () => {
            addToCartAudio.currentTime = 0;
            addToCartAudio.play();
        });
    });
}

/* add to cart */
function addToCart(event) {
    const id = parseInt(event.currentTarget.dataset.id);
    let cart = JSON.parse(localStorage.getItem(`cart`)) || [];
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id: id, quantity: 1 });
    localStorage.setItem(`cart`, JSON.stringify(cart));
    document.getElementById(`reddot`).style.display = `block`;
    addToCartAudio.currentTime = 0;
    addToCartAudio.play();
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
            let cartEmptyAudio = new Audio(`sounds/error.mp3`);
            cartEmptyAudio.play();
        }
    });
}

/* save login */
function saveData() {
    const data = document.getElementById(`dataInput`).value;
    localStorage.setItem(`userData`, data);
    displayData();
}

function displayData() {
    const savedData = localStorage.getItem(`userData`);
    if (savedData) document.getElementById(`savedData`).innerText = savedData;
}

displayData();

/* load shop products */
function loadShopProducts() {
    const container = document.getElementById(`productContainer`);
    if (!container) return;
    let stock = getStock();

    stock.forEach((item) => {
        const card = document.createElement(`div`);
        card.classList.add(`card`);
        card.dataset.id = item.id;

        card.innerHTML = `
            <p class="item-name">${item.name}</p>
            <img src="${item.image || item.link}" alt="${item.name}">
            <div class="cart-adding-div">
                <p class="price">€${item.price}</p>
                <button class="cart-adding-button" data-id="${item.id}">
                    <img class="add-to-cart-img" src="img/cart.png" alt="add-to-cart">
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    addCartListeners();
}

loadShopProducts();

/* add new products */
const addButton = document.getElementById(`add-button`);

if (addButton) {
    addButton.addEventListener(`click`, () => {
        let name = document.querySelector(`#new-product-name`).value;
        let price = document.querySelector(`#new-product-price`).value;
        let image = document.querySelector(`#imageInput`).value;

        let stock = getStock();
        let nextId = stock.length > 0 ? stock[stock.length - 1].id + 1 : 1;

        stock.push({
            id: nextId,
            name,
            price: parseFloat(price),
            image,
        });

        saveStock(stock);
        alert(`Product added!`);
        location.reload();
    });
}

/* load admin product list */
function loadAdminProducts() {
    let allProductsView = document.getElementById(`all-products-view`);
    if (!allProductsView) return;
    let stock = getStock();

    stock.forEach((product) => {
        let productDiv = document.createElement(`div`);
        productDiv.className = `product`;

        productDiv.innerHTML = `
            <p class="product-styling">${product.id}</p>
            <p class="product-styling">${product.name}</p>
            <p class="product-styling">${product.price}</p>
            <p class="product-styling">${product.image || product.link}</p>
        `;

        allProductsView.appendChild(productDiv);
    });

    makingEditButtons();
    makingDeleteButtons();
}

loadAdminProducts();

/* edit buttons */
function makingEditButtons() {
    document.querySelectorAll(`.product`).forEach((product) => {
        if (!product.querySelector(`.edit-button-styling`)) {
            let div = document.createElement(`div`);
            let btn = document.createElement(`button`);
            btn.innerText = `Edit`;
            btn.classList.add(`edit-button-styling`);
            div.classList.add(`product-styling`);
            div.appendChild(btn);
            product.appendChild(div);
        }
    });
}

document.addEventListener(`click`, function (e) {
    if (!e.target.classList.contains(`edit-button-styling`)) return;
    const productDiv = e.target.closest(`.product`);
    openEditForm(productDiv);
});

/* open edit form */
function openEditForm(productDiv) {
    if (productDiv.querySelector(`.edit-form`)) return;

    const id = productDiv.children[0].innerText;
    const name = productDiv.children[1].innerText;
    const price = productDiv.children[2].innerText;
    const link = productDiv.children[3].innerText;

    const form = document.createElement(`div`);
    form.classList.add(`edit-form`);

    form.innerHTML = `
        <input type="text" id="edit-name" value="${name}">
        <input type="number" id="edit-price" value="${price}">
        <input type="text" id="edit-link" value="${link}">
        <button class="save-edit" data-id="${id}">Save</button>
    `;

    productDiv.appendChild(form);
}

/* save edit */
document.addEventListener(`click`, function (e) {
    if (!e.target.classList.contains(`save-edit`)) return;

    const id = parseInt(e.target.dataset.id);
    let stock = getStock();
    let item = stock.find((p) => p.id === id);

    if (item) {
        item.name = document.getElementById(`edit-name`).value;
        item.price = parseFloat(document.getElementById(`edit-price`).value);
        item.image = document.getElementById(`edit-link`).value;

        saveStock(stock);
        alert(`Product updated!`);
        location.reload();
    }
});

/* delete buttons */
function makingDeleteButtons() {
    document.querySelectorAll(`.product`).forEach((product) => {
        if (!product.querySelector(`.delete-button-styling`)) {
            let div = document.createElement(`div`);
            let btn = document.createElement(`button`);
            btn.innerText = `Delete`;
            btn.classList.add(`delete-button-styling`);
            div.classList.add(`product-styling`);
            div.appendChild(btn);
            product.appendChild(div);
        }
    });
}

/* delete product */
document.addEventListener(`click`, (event) => {
    const btn = event.target.closest(`.delete-button-styling`);
    if (!btn) return;

    const productDiv = btn.closest(`.product`);
    const id = parseInt(productDiv.children[0].innerText);

    let stock = getStock();
    stock = stock.filter((item) => item.id !== id);

    saveStock(stock);
    alert(`Product deleted!`);
    location.reload();
});

/* reset stock */
const resetBtn = document.getElementById(`reset-button`);

if (resetBtn) {
    resetBtn.addEventListener(`click`, () => {
        fetch(`stock.json`)
            .then((res) => res.json())
            .then((data) => {
                saveStock(data.stock);
                alert(`Stock reset to original!`);
                location.reload();
            });
    });
}

/* order view */
function loadOrderView() {
    let ordersDiv = document.querySelector(`.admin-orders-view`);
    if (!ordersDiv) return;

    let allOrders = JSON.parse(localStorage.getItem(`Order`)) || [];
    let stock = getStock();

    allOrders.forEach((singleOrder, index) => {
        let title = document.createElement(`h3`);
        title.textContent = `0rder ${index + 1}`;
        ordersDiv.appendChild(title);

        singleOrder.forEach((orderItem) => {
            let product = stock.find((p) => p.id === orderItem.id);
            let p = document.createElement(`p`);

            if (product) {
                p.textContent = `${product.name} x${orderItem.quantity} — €${product.price}`;
            } else {
                p.textContent = `Product (ID ${orderItem.id}) bestaat niet meer`;
            }

            ordersDiv.appendChild(p);
        });

        ordersDiv.appendChild(document.createElement(`br`));
    });
}

loadOrderView();
