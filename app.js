// =======================
// Firebase Config
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyD13EXAMPLE", // Replace with your actual key
  authDomain: "food-ae7ff.firebaseapp.com",
  projectId: "food-ae7ff",
  storageBucket: "food-ae7ff.appspot.com",
  messagingSenderId: "256095054979",
  appId: "1:256095054979:web:22de2c16f9acb15f65a08f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =======================
// DISPLAY ALL ITEMS RANDOMLY
// =======================
const container = document.getElementById("categoriesContainer");

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

db.collection("products")
  .get()
  .then(snapshot => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const shuffled = shuffleArray(items);
    displayItems(shuffled);
  })
  .catch(err => console.error("❌ Error fetching products:", err));

function displayItems(products) {
  if (products.length === 0) {
    container.innerHTML = `<p class="text-gray-600 text-center">No products found.</p>`;
    return;
  }

  // Grid wrapper
  container.innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="productGrid"></div>
  `;

  const grid = document.getElementById("productGrid");

  products.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition-all duration-300 border";

    card.innerHTML = `
      <a href="product.html?id=${item.id}">
        <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-52 object-cover hover:scale-105 transition duration-300" />
      </a>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
        <p class="text-sm text-gray-500 mb-2">${item.description || ""}</p>
        <div class="flex items-center justify-between">
          <span class="text-green-600 font-bold">Ksh ${item.price}</span>
          <button 
            class="addToCart bg-primary hover:bg-red-600 text-white text-xs font-medium px-4 py-1.5 rounded-full transition"
            data-id="${item.id}"
            data-name="${item.name}"
            data-price="${item.price}"
            data-image="${item.imageUrl}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach cart logic
  setTimeout(() => {
    document.querySelectorAll(".addToCart").forEach(button => {
      button.addEventListener("click", () => {
        const product = {
          id: button.dataset.id,
          name: button.dataset.name,
          price: parseFloat(button.dataset.price),
          image: button.dataset.image,
          quantity: 1
        };
        addToCart(product);
      });
    });
  }, 100);
}

// =======================
// ADD TO CART FUNCTION
// =======================
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.findIndex(item => item.id === product.id);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`🛒 ${product.name} added to cart!`);
                              }
