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
// DISPLAY ALL PRODUCTS RANDOMLY
// =======================
const container = document.getElementById("categoriesContainer");

function shuffle(array) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

if (container) {
  db.collection("products")
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        let products = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          products.push({ id: doc.id, ...data });
        });

        // Shuffle for randomness
        products = shuffle(products);

        let html = `<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`;

        products.forEach(item => {
          html += `
            <div class="bg-white shadow rounded p-4">
              <a href="product.html?id=${item.id}">
                <img src="${item.imageUrl}" class="w-full h-40 object-cover rounded" alt="${item.name}" />
              </a>
              <h3 class="font-semibold mt-2 text-lg">${item.name}</h3>
              <p class="text-sm text-gray-600">${item.description || ''}</p>
              <div class="text-green-600 font-bold mt-1">Ksh ${item.price}</div>
              <button 
                class="addToCart bg-green-600 text-white px-3 py-1 mt-2 rounded w-full hover:bg-green-700"
                data-id="${item.id}"
                data-name="${item.name}"
                data-price="${item.price}"
                data-image="${item.imageUrl}">
                Add to Cart
              </button>
            </div>`;
        });

        html += `</div>`;
        container.innerHTML = html;

        // Attach Add to Cart events
        attachAddToCartEvents();
      } else {
        container.innerHTML = `<p class="text-center text-gray-500">No products available.</p>`;
      }
    })
    .catch(err => {
      console.error("❌ Error fetching products:", err);
      container.innerHTML = `<p class="text-red-500 text-center">Failed to load products.</p>`;
    });
}

// =======================
// ADD TO CART FUNCTION
// =======================
function attachAddToCartEvents() {
  const cartButtons = document.querySelectorAll('.addToCart');
  cartButtons.forEach(button => {
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
}

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
