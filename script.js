/* login */

/* standard prices */
fetch("stock.json")
    .then((response) => response.json())
    .then((data) => {
        const itemnames = document.getElementsByClassName("item-name");
        const prices = document.getElementsByClassName("price");

        for (let i = 0; i < itemnames.length; i++) {
            const name = itemnames[i].textContent;

            const item = data.stock.find((product) => product.name === name);

            if (item) {
                prices[i].textContent = `$${item.price}`;
            }
        }
    });
