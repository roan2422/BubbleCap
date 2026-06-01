function getStock() {
    return JSON.parse(localStorage.getItem(`all-stock`)) || [];
}

function saveStock(stock) {
    localStorage.setItem(`all-stock`, JSON.stringify(stock));
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
            <p class="product-styling">€${product.price}</p>
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
        item.name = document.getElementById(`edit-name`).value.trim();
        item.price = document.getElementById(`edit-price`).value.trim();
        item.image = document.getElementById(`edit-link`).value.trim();

        if (item.name === "" || item.price === "" || item.image === "") {
            alert(`You cannot leave an input field empty`);
        } else {
            saveStock(stock);
            alert(`Product updated!`);
            window.location.reload();
        }
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
    window.location.reload();
});
