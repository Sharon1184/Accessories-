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
// DISPLAY ITEMS BY CATEGORY
// =======================

const categories = ["Phones", "Laptops", "Clothing", "Beauty"];
const container = document.getElementById("categoriesContainer");

if (container) {
  categories.forEach(category => {
    db.collection("products")
      .where("category", "==", category)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          let html = `<h2 class='text-xl font-bold mt-8 mb-2'>${category}</h2>
          <div class='flex space-x-4 overflow-x-auto pb-4'>`;

          snapshot.forEach(doc => {
            const item = doc.data();
            const id = doc.id;

            html += `
              <div class='min-w-[200px] bg-white shadow p-2 rounded'>
                <a href="product.html?id=${id}">
                  <img src="${item.imageUrl}" class="w-full h-32 object-cover rounded" alt="${item.name}" />
                </a>
                <h3 class="font-semibold mt-2">${item.name}</h3>
                <p class="text-sm text-gray-600">${item.description}</p>
                <div class="text-red-500 font-bold mt-1">Ksh ${item.price}</div>
                <button 
                  class="addToCart bg-blue-600 text-white px-2 py-1 mt-2 rounded w-full"
                  data-id="${id}"
                  data-name="${item.name}"
                  data-price="${item.price}"
                  data-image="${item.imageUrl}">
                  Add to Cart
                </button>
              </div>`;
          });

          html += `</div>`;
          container.innerHTML += html;

          // Attach addToCart logic
          setTimeout(() => {
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
          }, 0);
        } else {
          console.log(`ℹ️ No items found in category: ${category}`);
        }
      })
      .catch(err => {
        console.error(`❌ Error loading ${category}:`, err);
      });
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
