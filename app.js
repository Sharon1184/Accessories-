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

// ======================= Display One Product Per Model =======================
const container = document.getElementById("categoriesContainer");

if (container) {
  db.collection("products").get().then(snapshot => {
    const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Group products by name
    const grouped = {};
    allProducts.forEach(product => {
      const key = product.name.trim();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(product);
    });

    // Pick one product from each group
    const uniqueProducts = Object.values(grouped).map(group => {
      return group[Math.floor(Math.random() * group.length)];
    });

    let html = `
      <h2 class="text-2xl font-bold text-primary mb-4">🛍 Featured Models</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    `;

    uniqueProducts.forEach(item => {
      html += `
        <div class="bg-white rounded-xl shadow hover:shadow-lg transition p-0">
          <a href="product.html?id=${item.id}">
            <img src="${item.imageUrl}" alt="${item.name}" 
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
              data-image="${item.imageUrl}">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Attach Add to Cart logic
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
  }).catch(err => {
    console.error("❌ Error loading items:", err);
  });
}

// ======================= Add to Cart Function =======================
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
