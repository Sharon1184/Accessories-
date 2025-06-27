// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD13EXAMPLE", // Replace with your actual API key
  authDomain: "food-ae7ff.firebaseapp.com",
  projectId: "food-ae7ff",
  storageBucket: "food-ae7ff.appspot.com",
  messagingSenderId: "256095054979",
  appId: "1:256095054979:web:22de2c16f9acb15f65a08f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Add Item Form Submission using URL input
const form = document.getElementById("addItemForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const price = parseFloat(form.price.value);
  const category = form.category.value;
  const imageUrl = form.imageUrl.value.trim(); // From URL input
  const statusMessage = document.getElementById("statusMessage");

  if (!name || !price || !category || !imageUrl) {
    statusMessage.textContent = "Please fill all fields and provide a valid image URL.";
    statusMessage.classList.add("text-red-600");
    return;
  }

  try {
    await db.collection("products").add({
      name,
      description,
      price,
      category,
      imageUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    statusMessage.textContent = "✅ Item added successfully!";
    statusMessage.classList.remove("text-red-600");
    statusMessage.classList.add("text-green-600");
    form.reset();
  } catch (error) {
    console.error("Error adding item:", error);
    statusMessage.textContent = "❌ Failed to add item.";
    statusMessage.classList.add("text-red-600");
  }
});

// Load and Display Products by Category
const categories = ["Phones", "Laptops", "Clothing", "Beauty"];
const container = document.getElementById("categoriesContainer");

if (container) {
  categories.forEach(category => {
    db.collection("products")
      .where("category", "==", category)
      .orderBy("timestamp", "desc")
      .limit(10)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          let html = `<h2 class='text-xl font-bold mt-8 mb-2'>${category}</h2>
          <div class='flex space-x-4 overflow-x-auto pb-4'>`;

          snapshot.forEach(doc => {
            const item = doc.data();
            html += `
              <div class='min-w-[200px] bg-white shadow p-2 rounded'>
                <img src="${item.imageUrl}" class="w-full h-32 object-cover rounded" alt="${item.name}" />
                <h3 class="font-semibold mt-2">${item.name}</h3>
                <p class="text-sm text-gray-600">${item.description}</p>
                <div class="text-red-500 font-bold mt-1">Ksh ${item.price}</div>
                <button class="bg-primary text-white px-2 py-1 mt-2 rounded w-full">Add to Cart</button>
              </div>`;
          });

          html += `</div>`;
          container.innerHTML += html;
        }
      })
      .catch(error => {
        console.error("Error loading products:", error);
      });
  });
}
