function getStock() {
    return JSON.parse(localStorage.getItem(`all-stock`)) || [];
}

function saveStock(stock) {
    localStorage.setItem(`all-stock`, JSON.stringify(stock));
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
        let total = 0;

        singleOrder.forEach((orderItem) => {
            let product = stock.find((p) => p.id === orderItem.id);
            let p = document.createElement(`p`);

            if (product) {
                p.textContent = `${product.name} x${orderItem.quantity} — €${product.price}`;
                total += product.price * orderItem.quantity;
            } else {
                p.textContent = `Product (ID ${orderItem.id}) bestaat niet meer`;
            }

            ordersDiv.appendChild(p);
        });

        let totalP = document.createElement(`p`);
        totalP.textContent = `Total: €${total.toFixed(2)}`;
        totalP.style.fontWeight = "bold";
        ordersDiv.appendChild(totalP);

        ordersDiv.appendChild(document.createElement(`br`));
    });
}

loadOrderView();

/* reset stock */
const resetBtn = document.getElementById(`reset-button`);

if (resetBtn) {
    resetBtn.addEventListener(`click`, () => {
        fetch(`/json/stock.json`)
            .then((res) => res.json())
            .then((data) => {
                saveStock(data.stock);
                alert(`Stock reset to original!`);
                window.location.reload();
            });
    });
}

/* orders-view-button */
document.querySelector(`.orders-view-button`).addEventListener(`click`, windowToProducts);

function windowToProducts() {
    window.location = `products.html`;
}

/* add-button */
document.querySelector(`.add-button`).addEventListener(`click`, windowToAddProducts);
function windowToAddProducts() {
    window.location = `add-product.html`;
}
