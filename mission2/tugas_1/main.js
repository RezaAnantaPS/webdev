class Item {
  constructor(cardElement) {
    this.cardElement = cardElement;
    this.name = cardElement.querySelector(".card-title").innerText;
    this.price = parseInt(
      cardElement
        .querySelector(".card-text")
        .innerText.replace("Rp", "")
        .replace(".", "")
    );
    this.counterInput = cardElement.querySelector("#counterInput");
  }

  getCount() {
    return parseInt(this.counterInput.value);
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  addItem(item, count) {
    const existingItem = this.items.find((cartItem) => cartItem.item === item);

    if (existingItem) {
      existingItem.count += count;
    } else {
      this.items.push({ item, count });
    }
  }
  // addItem(item, count) {
  //   this.items.push({ item, count });
  // }

  calculateTotalPrice() {
    let totalPrice = 0;
    for (const cartItem of this.items) {
      totalPrice += cartItem.item.price * cartItem.count;
    }
    return totalPrice;
  }

  calculateTax(totalPrice) {
    return totalPrice * 0.11;
  }

  updateTotalPriceTable() {
    const totalPrice = this.calculateTotalPrice();
    const tax = this.calculateTax(totalPrice);
    const totalPriceWithTax = totalPrice + tax;

    // Update the table rows with new total values
    const totalPembelianRow = document.querySelector(".total-pembelian");
    const pajakRow = document.querySelector(".pajak");
    const totalBayarRow = document.querySelector(".total-bayar");

    totalPembelianRow.querySelector(
      "td:last-child"
    ).textContent = `Rp${totalPrice.toLocaleString()}`;
    pajakRow.querySelector(
      "td:last-child"
    ).textContent = `Rp${tax.toLocaleString()}`;
    totalBayarRow.querySelector(
      "td:last-child"
    ).textContent = `Rp${totalPriceWithTax.toLocaleString()}`;
  }
}

// Create instances of Cart and Item classes
const cart = new Cart();
const itemElements = document.querySelectorAll(".card");
const items = Array.from(itemElements).map(
  (cardElement) => new Item(cardElement)
);

// Add event listeners
items.forEach((item) => {
  const incrementBtn = item.cardElement.querySelector("#incrementBtn");
  const decrementBtn = item.cardElement.querySelector("#decrementBtn");
  const addButton = item.cardElement.querySelector(".btn-input");

  incrementBtn.addEventListener("click", () => {
    increment(item);
  });

  decrementBtn.addEventListener("click", () => {
    decrement(item);
  });

  addButton.addEventListener("click", () => {
    addItemToCart(item); // Pass the instance of Item, not DOM element
  });
});

function increment(item) {
  const currentValue = item.getCount();
  item.counterInput.value = currentValue + 1;
}

function decrement(item) {
  const currentValue = item.getCount();
  if (currentValue > 0) {
    item.counterInput.value = currentValue - 1;
  }
}


// Function to add an item to the cart
function addItemToCart(item) {
  const itemCard = item.cardElement;
  const itemName = itemCard.querySelector(".card-title").innerText;
  const itemPrice = parseInt(
    itemCard
      .querySelector(".card-text")
      .innerText.replace("Rp", "")
      .replace(".", "")
  );
  const itemCount = item.getCount();

  if (itemCount > 0) {
    // Cek apakah item sudah ada di keranjang
    const existingCartItem = cart.items.find(
      (cartItem) => cartItem.item.name === itemName
    );

    if (existingCartItem) {
      // Item sudah ada, tambahkan jumlahnya
      existingCartItem.count += itemCount;
    } else {
      // Item belum ada, tambahkan item baru ke keranjang
      cart.addItem(item, itemCount);
    }

    // Dapatkan elemen list keranjang jika sudah ada
    const listItem = document.querySelector(
      `.my-cart .list-group-item[data-name="${itemName}"]`
    );

    if (listItem) {
      // Jika item sudah ada di dalam list, update jumlah dan subtotalnya
      const itemCountElement = listItem.querySelector(".item-count");
      itemCountElement.textContent = existingCartItem.count;

      const itemSubtotalElement = listItem.querySelector(".subtotal");
      const itemSubtotal = itemPrice * existingCartItem.count;
      itemSubtotalElement.innerHTML = `<b>Rp${itemSubtotal.toLocaleString()}</b>`;
    } else {
      // Item belum ada di dalam list, tambahkan item baru ke list
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-start"
      );
      listItem.setAttribute("data-name", itemName);

      const image = itemCard.querySelector(".card-img-top").cloneNode();
      const itemDetails = document.createElement("div");
      itemDetails.classList.add("ms-2", "me-auto", "ps-2");
      itemDetails.innerHTML = `
        <div class="fw-bold">${itemName}</div>
        <div class="subtotal-item d-flex">
          <p>Rp${itemPrice.toLocaleString()}</p>
          <p>&nbsp; X &nbsp;</p>
          <span class="item-count">${itemCount}</span>
        </div>
      `;

      // Inisialisasi elemen `.subtotal` dengan nilai awal
      const subtotalElement = document.createElement("span");
      subtotalElement.classList.add("subtotal", "my-auto");
      const itemSubtotal = itemPrice * itemCount;
      subtotalElement.innerHTML = `<b>Rp${itemSubtotal.toLocaleString()}</b>`;

      // Tambahkan tombol "Kurangi" dan "Hapus" ke dalam container
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("action-buttons");

      // Tombol "Kurangi"
      const decrementButton = document.createElement("button");
      decrementButton.classList.add("btn", "btn-primary");
      decrementButton.textContent = "-";
      decrementButton.addEventListener("click", () => {
        decrementCartItem(item);
      });

      // Tombol "Tambah"
      const incrementButton = document.createElement("button");
      incrementButton.classList.add("btn", "btn-primary");
      incrementButton.textContent = "+";
      incrementButton.addEventListener("click", () => {
        incrementCartItem(item);
      });

      // Tombol "Hapus"
      const removeButton = document.createElement("button");
      removeButton.classList.add("btn", "btn-danger");
      removeButton.textContent = "Hapus";
      removeButton.addEventListener("click", () => {
        removeCartItem(item);
      });

      // Tambahkan elemen-elemen ke dalam container tombol
      buttonContainer.appendChild(decrementButton);
      buttonContainer.appendChild(incrementButton);
      buttonContainer.appendChild(removeButton);

      // Tambahkan container tombol ke dalam elemen `.item-details`
      itemDetails.appendChild(buttonContainer);

      listItem.appendChild(image);
      listItem.appendChild(itemDetails);
      listItem.appendChild(subtotalElement);

      document.querySelector(".my-cart").appendChild(listItem);
    }

    cart.updateTotalPriceTable();

    // Clear the counterInput
    itemCard.querySelector("#counterInput").value = "0";
  }
}


function incrementCartItem(item) {
  const existingItem = cart.items.find(
    (cartItem) => cartItem.item.name === item.name
  );

  if (existingItem) {
    existingItem.count += 1;

    // Update tampilan jumlah item pada elemen yang sesuai
    const listItem = document.querySelector(
      `.my-cart .list-group-item[data-name="${item.name}"]`
    );
    if (listItem) {
      const itemCountElement = listItem.querySelector(".item-count");
      itemCountElement.textContent = existingItem.count;

      const itemSubtotalElement = listItem.querySelector(".subtotal");
      const itemPrice = parseInt(
        item.cardElement
          .querySelector(".card-text")
          .innerText.replace("Rp", "")
          .replace(".", "")
      );
      const itemSubtotal = itemPrice * existingItem.count;
      itemSubtotalElement.innerHTML = `<b>Rp${itemSubtotal.toLocaleString()}</b>`;
    }

    cart.updateTotalPriceTable();
  }
}


function decrementCartItem(item) {
  const existingItem = cart.items.find(
    (cartItem) => cartItem.item.name === item.name
  );

  if (existingItem) {
    if (existingItem.count > 1) {
      existingItem.count -= 1;

      // Update tampilan jumlah item pada elemen yang sesuai
      const listItem = document.querySelector(
        `.my-cart .list-group-item[data-name="${item.name}"]`
      );
      if (listItem) {
        const itemCountElement = listItem.querySelector(".item-count");
        itemCountElement.textContent = existingItem.count;

        const itemSubtotalElement = listItem.querySelector(".subtotal");
        const itemPrice = parseInt(
          item.cardElement
            .querySelector(".card-text")
            .innerText.replace("Rp", "")
            .replace(".", "")
        );
        const itemSubtotal = itemPrice * existingItem.count;
        itemSubtotalElement.innerHTML = `<b>Rp${itemSubtotal.toLocaleString()}</b>`;
      }
    } else {
      removeCartItem(item); // Jika jumlah item hanya satu, hapus item dari keranjang
    }

    cart.updateTotalPriceTable();
  }
}

function removeCartItem(item) {
  // Hapus item dari keranjang
  const index = cart.items.findIndex(
    (cartItem) => cartItem.item.name === item.name
  );
  if (index !== -1) {
    cart.items.splice(index, 1);
    cart.updateTotalPriceTable();
  }

  // Hapus tampilan item dari daftar di halaman
  const listItem = document.querySelector(
    `.my-cart .list-group-item[data-name="${item.name}"]`
  );
  if (listItem) {
    listItem.remove();
  }
}


// Fungsi untuk menambahkan item baru ke dalam daftar items
function addItemToItems(name, price, imgSrc) {
  const newCardElement = document.createElement("div");
  newCardElement.classList.add("card");
  newCardElement.innerHTML = `
    <img src="${imgSrc}" class="card-img-top img-fluid" alt="...">
    <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${price}</p>
        <center>
            <div class="input-group">
                <button class="btn btn-primary" id="decrementBtn">-</button>
                <input type="text" class="form-control text-center" id="counterInput" value="0" readonly>
                <button class="btn btn-primary" id="incrementBtn">+</button>
            </div>
            <button type="button" class="btn-input btn btn-success">Tambah Barang</button>
        </center>
    </div>
  `;

  const newItem = new Item(newCardElement);

  const incrementBtn = newItem.cardElement.querySelector("#incrementBtn");
  const decrementBtn = newItem.cardElement.querySelector("#decrementBtn");
  const addButton = newItem.cardElement.querySelector(".btn-input");

  incrementBtn.addEventListener("click", () => {
    increment(newItem);
  });

  decrementBtn.addEventListener("click", () => {
    decrement(newItem);
  });

  addButton.addEventListener("click", () => {
    addItemToCart(newItem);
  });

  items.push(newItem);
  document.querySelector(".items").appendChild(newCardElement);
}

// Function to add items from JSON data
function addItemsFromJSON(data) {
  data.forEach((itemData) => {
    addItemToItems(itemData.name, itemData.price, itemData.imgSrc);
  });
}

async function fetchAndAddItemsFromJSON() {
  try {
    const response = await fetch("assets/data/items.json"); // Replace with the actual path
    const jsonData = await response.json();

    addItemsFromJSON(jsonData);
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

fetchAndAddItemsFromJSON();

document.getElementById("showStrukBtn").addEventListener("click", function () {
  // Get the cart items
  const cartItems = cart.items;

  // Create an HTML structure for the cart details
  let cartDetailsHTML = '<table class="table caption-top">';
  cartDetailsHTML += `<thead>
      <tr>
        <th>Nama Item</th>
        <th><center>Price</center></th>
        <th><center>Quantity</center></th>
        <th><center>Subtotal</center></th>
      </tr>
    </thead>
    `;
  cartDetailsHTML += "<tbody>";

  let total = 0;

  // Loop through cart items and add details to the HTML structure
  for (const cartItem of cartItems) {
    const itemName = cartItem.item.name;
    const itemPrice = cartItem.item.price;
    const itemCount = cartItem.count;
    const itemSubtotal = cartItem.item.price * itemCount;

    cartDetailsHTML += `
      <tr>
        <td>${itemName}</td>
        <td class="text-center">Rp${itemPrice.toLocaleString()}</td> 
        <td class="text-center">${itemCount}</td>
        <td class="text-center">Rp${itemSubtotal.toLocaleString()}</td>
      </tr>
    `;

    total += itemSubtotal;
  }

  cartDetailsHTML += "</tbody>";
  cartDetailsHTML += "</table>";

  // Calculate tax and total payment
  const totalPrice = total;
  const tax = cart.calculateTax(totalPrice);
  const totalPriceWithTax = totalPrice + tax;

  // Add tax and total payment to the HTML structure
  cartDetailsHTML += `
    <p class="text-end"><b>Total Pembelian: Rp${total.toLocaleString()}</b></p>
    <p class="text-end"><b>Pajak: Rp${tax.toLocaleString()}</b></p>
    <p class="text-end"><b>Total Bayar: Rp${totalPriceWithTax.toLocaleString()}</b></p>
  `;

  // Put the HTML structure inside the modal content
  const strukContentElement = document.getElementById("strukContent");
  strukContentElement.innerHTML = cartDetailsHTML;

  // Show the modal
  const strukModal = new bootstrap.Modal(document.getElementById("strukModal"));
  strukModal.show();
});
