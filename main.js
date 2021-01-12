import { products } from './db.js';

function localStorageSpace() {

    // 100 db termék = 5242732 byte
    // 0 db termék = 5242878 byte
    // 1db termék = 1, 46 byte helyet igényel a kosárban!
    // A kosár kapacitása nagyjából: 3 591 012 db termékre "korlátozódik".

    let sizeBit = (1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length);
};

displayProducts();
function displayProducts() {
    let shopContainer = document.querySelector('.shop-container');

    if (shopContainer) {
        shopContainer.innerHTML = '';

        Object.values(products).map(item => {
            shopContainer.innerHTML += `
        <div class="prod-prev-box">
        <img src="./img/${item.tag}.jpg" alt="">
            <h3>${item.name}</h3>
            <h3>$${item.price},00</h3>
            <a class="add-cart" href="#">Add Cart!</a>
        </div>`
        });
    }
    else {
        console.log("Nem tudom betölteni a listát");
    }
}


let prodPrevBoxes = document.querySelectorAll('.prod-prev-box');

for (let j = 0; j < prodPrevBoxes.length; j++) {

    const anchorBtn = prodPrevBoxes[j].querySelector("[class=add-cart]");

    prodPrevBoxes[j].addEventListener("mouseover", () => {
        anchorBtn.classList.add("showBasketBtn");
    })

    prodPrevBoxes[j].addEventListener("mouseleave", () => {
        anchorBtn.classList.remove("showBasketBtn");
    })
}


const carts = document.querySelectorAll('.add-cart');
const cartCounter = document.querySelector('.cart span');

for (let i = 0; i < carts.length; i++) {

    carts[i].addEventListener("click", () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })

}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);


    if (productNumbers) {
        cartCounter.textContent = productNumbers;
    }
    else if (productNumbers === 0) {
        cartCounter.textContent = 0;
    }

}

function cartNumbers(product) {

    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);

    } else {
        localStorage.setItem('cartNumbers', 1);
    }

    setItems(product);

    onLoadCartNumbers();


}


function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {

        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }

        cartItems[product.tag].inCart += 1;

    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));

}


function totalCost(product) {

    let cartCost = localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);


    if (cartCost) {
        localStorage.setItem("totalCost", cartCost + product.price);
    }
    else {
        localStorage.setItem("totalCost", product.price);
    }

}



function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    let cartNumbers = localStorage.getItem("cartNumbers");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');
    let osszes = 0;

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            osszes += item.inCart;
            productContainer.innerHTML += `
                <div class="product">
                    <div class="product-info"><span class ="itemTag" style="display: none">${item.tag}</span><i class="fas fa-trash-alt removeItem" id="deleteProdIcon"></i><img src="./img/${item.tag}.jpg"><span>${item.name}</span>
                    </div>
                    <div class="price">$${item.price}</div>
                    <div class="quantity">
                        <i class="fas fa-minus-square quantityIcons quantityMinus" id="quantityIcon1"></i><input type="number" class="item-quantity" value=${item.inCart} min="1"></input>
                        <i class="fas fa-plus-square quantityIcons quantityPlus" id="quantityIcon2"></i>
                    </div>
                    <div class="total">$${item.inCart * item.price},00</div>
                </div>
            `
        });

        productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">Basket Total</h4>
            <h4 class="basketInTotalProducts">${cartNumbers} item</h4>
            <h4 class="basketTotal">$${cartCost},00</h4>
        </div>`

        productContainer.innerHTML += `
        <div class="basketFooterButtons">
            <button class="clearCartBtn" type="submit">Kosár ürítése</button>
            <a href="./index.html"<button class="backToShopBtn">Vissza a shopba!</button></a>
            <button class="orderCartBtn">Rendelés leadása</button>
        </div>`

        let clearCartBtn = document.querySelector('.clearCartBtn');
        clearCartBtn.addEventListener('click', () => {
            if (confirm("A kosár teljes tartalmát töröljük!\nBiztosan ezt szeretnéd?")) {
                clearCart();
                location.href = "index.html";

            }
        });

        let minusItem = document.querySelectorAll('.quantityMinus');
        let plusItem = document.querySelectorAll('.quantityPlus');
        let itemQuantity = document.querySelectorAll('.item-quantity');
        let selectedItem = document.querySelectorAll('.removeItem');

        plus_1_item(plusItem);
        minus_1_item(minusItem);
        removeItemfromCart(selectedItem);
        item_set_quantity(itemQuantity);
    }

    else {
        if (productContainer) {
            productContainer.innerHTML = `<h4>No products in the cart!</h4> `
        }

    }



}

function removeItemfromCart(selectedItem) {

    for (let i = 0; i < selectedItem.length; i++) {

        const tag = selectedItem[i].parentElement.firstChild.textContent;

        selectedItem[i].addEventListener("click", () => {
            removeFromCart(tag);
        })
    }
    onLoadCartNumbers();

}

function removeFromCart(tag) {

    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    // A kosár összértékének módosítása
    let cartCost = localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost - cartItems[tag].price * cartItems[tag].inCart);

    // A kosár darabszám tartalmának szinkornizálása
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    localStorage.setItem('cartNumbers', productNumbers - cartItems[tag].inCart);


    // A kosár tartalmának törlése
    delete cartItems[tag];
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));



    if (JSON.stringify(cartItems).length < 3) {
        localStorage.removeItem('productsInCart');
    }

    onLoadCartNumbers();

    displayCart();

}




function clearCart() {
    localStorage.removeItem('cartNumbers');
    localStorage.removeItem('totalCost');
    localStorage.removeItem('productsInCart');
    location.reload();

}

onLoadCartNumbers();
displayCart();



// Add event listener to remove items from Cart



function plus_1_item(plusItem) {
    for (let i = 0; i < plusItem.length; i++) {

        const tag = plusItem[i].parentElement.parentElement.firstElementChild.firstElementChild.textContent;
        const productIndex = tag.substring(7, tag.length) - 1;


        plusItem[i].addEventListener("click", () => {


            cartNumbers(products[productIndex]);
            totalCost(products[productIndex]);
            displayCart();

        });
    }
}

function minus_1_item(minusItem) {
    for (let i = 0; i < minusItem.length; i++) {

        const tag = minusItem[i].parentElement.parentElement.firstElementChild.firstElementChild.textContent;

        minusItem[i].addEventListener("click", () => {

            let cartItems = localStorage.getItem("productsInCart");
            cartItems = JSON.parse(cartItems);

            if (cartItems[tag].inCart > 1) {
                // A kosár összértékének módosítása
                let cartCost = localStorage.getItem('totalCost');
                cartCost = parseInt(cartCost);
                localStorage.setItem("totalCost", cartCost - cartItems[tag].price);

                // A kosár darabszám tartalmának szinkornizálása
                let productNumbers = localStorage.getItem('cartNumbers');
                productNumbers = parseInt(productNumbers);
                localStorage.setItem('cartNumbers', productNumbers - 1);

                cartItems[tag].inCart -= 1;
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));

                onLoadCartNumbers();
                displayCart();

            }
        })
    }

}

function item_set_quantity(itemQuantity) {

    for (let i = 0; i < itemQuantity.length; i++) {

        const tag = itemQuantity[i].parentElement.parentElement.firstElementChild.firstElementChild.textContent;
        const productIndex = tag.substring(7, tag.length) - 1;

        let cartItems = localStorage.getItem("productsInCart");
        cartItems = JSON.parse(cartItems);

        itemQuantity[i].addEventListener("input", () => {


            if (itemQuantity[i].value < 0 || itemQuantity[i].value % 1 < 1 && itemQuantity[i].value % 1 != 0) {
                itemQuantity[i].value = 1;
            }

            //Aktuális darabszám lekérdezése:
            const actualCount = cartItems[tag].inCart;
            var quantityDifference = itemQuantity[i].value - actualCount;

            // A kosár összértékének módosítása

            let cartCost = localStorage.getItem('totalCost');
            cartCost = parseInt(cartCost); // Kosár aktuális értéke

            console.log("Kosár mentett értéke: ", cartCost);
            console.log("Kosár új értéke: ", cartCost + cartItems[tag].price * quantityDifference);
            localStorage.setItem("totalCost", cartCost + cartItems[tag].price * quantityDifference);

            // A kosár darabszám tartalmának szinkornizálása
            let productNumbers = localStorage.getItem('cartNumbers');
            productNumbers = parseInt(productNumbers);

            console.log("Kosár mentett darabszáma: ", itemQuantity[i].value);
            console.log("differencia: ", quantityDifference);
            console.log("Kosár új darabszáma: ", productNumbers + quantityDifference);

            cartItems[tag].inCart = parseInt(itemQuantity[i].value);
            localStorage.setItem('cartNumbers', productNumbers + quantityDifference);


            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            onLoadCartNumbers();
            displayCart();

        });
    }
}

window.addEventListener('storage', () => {
    location.reload();
    displayProducts();
})




