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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =======================
// DISPLAY ALL PRODUCTS RANDOMLY
// =======================
const container = document.getElementById("categoriesContainer");

if (container) {
  db.collection("products").get()
    .then(snapshot => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const shuffled = products.sort(() => 0.5 - Math.random());

      let html = `
        <h2 class="text-2xl font-bold text-primary mb-4">🛒 All Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      `;

      shuffled.forEach(item => {
        const image = Array.isArray(item.images) && item.images.length ? item.images[0] : item.imageUrl || "placeholder.jpg";

        html += `
          <div class="bg-white rounded-xl shadow hover:shadow-lg transition p-0">
            <a href="product.html?id=${item.id}">
              <img src="${image}" alt="${item.name}" 
                   class="w-full h-72 object-contain bg-white rounded-t-xl p-2" />
            </a>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
              <p class="text-sm text-gray-500">${item.description || ""}</p>
              <div class="mt-2 mb-3 text-green-600 font-bold">Ksh ${item.price}</div>
              <button 
                class="addToCart bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg text-sm font-medium transition"
                data-id="${item.id}"
                data-name="${item.name}"
                data-price="${item.price}"
                data-image="${image}">
                Add to Cart
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;

      // Attach Add to Cart
      setTimeout(() => {
        document.querySelectorAll('.addToCart').forEach(button => {
          button.addEventListener('click', () => {
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
      }, 0);
    })
    .catch(err => {
      console.error("❌ Error loading items:", err);
    });
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
