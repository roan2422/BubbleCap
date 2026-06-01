function getStock() {
    return JSON.parse(localStorage.getItem(`all-stock`)) || [];
}

function saveStock(stock) {
    localStorage.setItem(`all-stock`, JSON.stringify(stock));
}

/* add new products */
const addButton = document.getElementById(`add-button`);

if (addButton) {
    addButton.addEventListener(`click`, () => {
        let name = document.querySelector(`#new-product-name`).value;
        let price = document.querySelector(`#new-product-price`).value;
        let image = document.querySelector(`#imageInput`).value;

        if (name.trim() === "" || price.trim() === "" || image.trim() === "") {
            alert(`You cannot leave an input field empty`);
            return;
        }

        if (price < 0) {
            alert(`Price cannot be negative!`);
            return;
        }

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
        window.location.replace(`products.html`);
    });
}
