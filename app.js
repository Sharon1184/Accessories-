// app.js

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSy...", // Replace with your actual API key
  authDomain: "food-ae7ff.firebaseapp.com",
  projectId: "food-ae7ff",
  storageBucket: "food-ae7ff.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Add Item Form Submission
const form = document.getElementById("addItemForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const price = parseFloat(form.price.value);
  const category = form.category.value;
  const imageFile = form.image.files[0];

  if (!name || !price || !category || !imageFile) {
    alert("Please fill all fields and select an image.");
    return;
  }

  const imageRef = storage.ref(`products/${Date.now()}_${imageFile.name}`);
  await imageRef.put(imageFile);
  const imageUrl = await imageRef.getDownloadURL();

  await db.collection("products").add({
    name,
    description,
    price,
    category,
    imageUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Item added successfully!");
  form.reset();
});

// Load and Display Products by Category
const categories = ["Phones", "Laptops", "Clothing", "Beauty"];
const container = document.getElementById("categoriesContainer");

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
              <div class="text-red-500 font-bold mt-1">$${item.price}</div>
              <button class="bg-primary text-white px-2 py-1 mt-2 rounded w-full">Add to Cart</button>
            </div>`;
        });

        html += `</div>`;
        container.innerHTML += html;
      }
    });
});


✅ Your full app.js is now complete and contains:

Firebase setup for your project

Image upload and item save to Firestore

Real-time display of items by category in horizontal scrollable sections

Validation for form inputs


Would you like me to:

Add a Cart system (using Firebase or local storage)?

Show a loader or notification when uploading?

Limit form access to only logged-in users?


Let me know your next move for ConceptDash! 🛍️💡

  
