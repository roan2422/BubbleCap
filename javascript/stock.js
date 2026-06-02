/* stock into localstorage */
if (!localStorage.getItem("all-stock")) {
    fetch("/json/stock.json")
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("all-stock", JSON.stringify(data.stock));
        });
}

function getStock() {
    return JSON.parse(localStorage.getItem(`all-stock`)) || [];
}

function saveStock(stock) {
    localStorage.setItem(`all-stock`, JSON.stringify(stock));
}

/* cart sound */
let addToCartAudio = new Audio(`../sounds/kashing.mp3`);

/* cart listeners */
function addCartListeners() {
    document.querySelectorAll(`.cart-adding-button`).forEach((button) => {
        button.addEventListener(`click`, () => {
            addToCart();
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
                    <img class="add-to-cart-img" src="../img/cart.png" alt="add-to-cart">
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    addCartListeners();
}

loadShopProducts();
