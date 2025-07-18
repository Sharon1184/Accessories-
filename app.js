// ======================= Firebase Config =======================
const firebaseConfig = {
  apiKey: "AIzaSyB1geQ2jsqrAGw50NLnBncWvxCPD_n5Kqk",
  authDomain: "concept-dash-e1b60.firebaseapp.com",
  projectId: "concept-dash-e1b60",
  storageBucket: "concept-dash-e1b60.appspot.com",
  messagingSenderId: "442954536333",
  appId: "1:442954536333:web:143a03ca359ba3219bd9c4",
  measurementId: "G-RYXJVCDF9K"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ======================= Render Unique Models on Homepage =======================
const container = document.getElementById("categoriesContainer");

if (container) {
  db.collection("products")
    .get()
    .then(snapshot => {
      const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Group by product name
      const groupedByName = {};
      allProducts.forEach(item => {
        const key = item.name?.trim().toLowerCase();
        if (!groupedByName[key]) groupedByName[key] = [];
        groupedByName[key].push(item);
      });

      // Select one random product from each group
      const featuredProducts = Object.values(groupedByName).map(group => {
        return group[Math.floor(Math.random() * group.length)];
      });

      // Build HTML
      let html = `
        <h2 class="text-2xl font-bold text-primary mb-4">🛍 Featured Models</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      `;

      featuredProducts.forEach(product => {
        html += `
          <div class="bg-white rounded-xl shadow hover:shadow-lg transition p-0">
            <a href="brand.html?name=${encodeURIComponent(product.name)}">
              <img src="${product.imageUrl || 'placeholder.jpg'}" 
                   alt="${product.name}" 
                   class="w-full h-72 object-contain bg-white rounded-t-xl p-2" />
            </a>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
              <p class="text-sm text-gray-500">${product.description || 'No description available.'}</p>
              <div class="mt-2 mb-3 text-green-600 font-bold">From Ksh ${product.price}</div>
              <button 
                class="addToCart bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg text-sm font-medium transition"
                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${product.price}"
                data-image="${product.imageUrl}">
                Add to Cart
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;

      // Add to cart listeners
      attachCartListeners();
    })
    .catch(err => {
      console.error("❌ Error loading products:", err);
      container.innerHTML = `<p class="text-red-600">Failed to load products. Please try again later.</p>`;
    });
}

// ======================= Add to Cart Function =======================
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`🛒 ${product.name} added to cart!`);
}

// ======================= Attach Cart Button Listeners =======================
function attachCartListeners() {
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
          }
