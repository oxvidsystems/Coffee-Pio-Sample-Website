import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDxWQUo5h6f0KonKZmgBUFj1xmyrB-C0Ds",
  authDomain: "my-coffee-shop-oxvid.firebaseapp.com",
  projectId: "my-coffee-shop-oxvid",
  storageBucket: "my-coffee-shop-oxvid.firebasestorage.app",
  messagingSenderId: "604393720500",
  appId: "1:604393720500:web:5c99743d25f8e847baa5e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');

const navBtns = document.querySelectorAll('.nav-btn');
const viewSections = document.querySelectorAll('.view-section');

// Product Elements
const productsList = document.getElementById('products-list');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const productForm = document.getElementById('product-form');
let currentEditingProductId = null;

// Content Elements
const contentForm = document.getElementById('content-form');
const contentSuccess = document.getElementById('content-success');


// ==========================================
// Authentication
// ==========================================

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    authContainer.classList.remove('active');
    dashboardContainer.classList.add('active');
    loadProducts();
    loadContent();
  } else {
    // User is signed out
    authContainer.classList.add('active');
    dashboardContainer.classList.remove('active');
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = document.getElementById('login-btn');
  
  try {
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    await signInWithEmailAndPassword(auth, email, password);
    authError.textContent = '';
  } catch (error) {
    console.error(error);
    authError.textContent = error.message;
  } finally {
    btn.textContent = 'Login';
    btn.disabled = false;
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// ==========================================
// Navigation
// ==========================================

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    navBtns.forEach(b => b.classList.remove('active'));
    viewSections.forEach(s => s.classList.remove('active'));
    
    // Add active class to clicked
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});


// ==========================================
// Products Management
// ==========================================

async function loadProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    productsList.innerHTML = '';
    
    if (querySnapshot.empty) {
      productsList.innerHTML = '<tr><td colspan="5">No products found. Add one!</td></tr>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const p = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.image || ''}" class="product-img-thumb" alt="${p.name}"></td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${(p.description || '').substring(0, 50)}...</td>
        <td class="actions">
          <button class="btn btn-outline edit-btn" data-id="${doc.id}">Edit</button>
          <button class="btn btn-danger delete-btn" data-id="${doc.id}">Delete</button>
        </td>
      `;
      productsList.appendChild(tr);
    });

    // Attach event listeners to new buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => openEditModal(e.target.getAttribute('data-id')));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => deleteProduct(e.target.getAttribute('data-id')));
    });

  } catch (error) {
    console.error("Error loading products: ", error);
    if(error.code === 'permission-denied') {
        productsList.innerHTML = '<tr><td colspan="5" style="color:red">Permission denied. Ensure Firestore rules are configured.</td></tr>';
    }
  }
}

// Modal Logic
addProductBtn.addEventListener('click', () => {
  currentEditingProductId = null;
  productForm.reset();
  document.getElementById('modal-title').textContent = 'Add New Product';
  productModal.classList.add('active');
});

closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    productModal.classList.remove('active');
  });
});

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('save-product-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const productData = {
    name: document.getElementById('product-name').value,
    price: document.getElementById('product-price').value,
    description: document.getElementById('product-desc').value,
    image: document.getElementById('product-image').value,
    badge: document.getElementById('product-badge').value
  };

  try {
    if (currentEditingProductId) {
      await updateDoc(doc(db, "products", currentEditingProductId), productData);
    } else {
      await addDoc(collection(db, "products"), productData);
    }
    productModal.classList.remove('active');
    loadProducts(); // Reload list
  } catch (error) {
    console.error("Error saving product: ", error);
    alert("Error saving product: " + error.message);
  } finally {
    btn.textContent = 'Save Product';
    btn.disabled = false;
  }
});

async function openEditModal(id) {
  try {
    const docSnap = await getDoc(doc(db, "products", id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      currentEditingProductId = id;
      
      document.getElementById('product-name').value = data.name || '';
      document.getElementById('product-price').value = data.price || '';
      document.getElementById('product-desc').value = data.description || '';
      document.getElementById('product-image').value = data.image || '';
      document.getElementById('product-badge').value = data.badge || '';
      
      document.getElementById('modal-title').textContent = 'Edit Product';
      productModal.classList.add('active');
    }
  } catch (error) {
    console.error("Error fetching product: ", error);
  }
}

async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteDoc(doc(db, "products", id));
      loadProducts();
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert("Error deleting product.");
    }
  }
}


// ==========================================
// Website Content Management
// ==========================================

async function loadContent() {
  try {
    const docSnap = await getDoc(doc(db, "content", "home"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Global
      document.getElementById('logo-text').value = data.logoText || '';
      document.getElementById('video-url').value = data.videoUrl || '';
      
      // Hero
      document.getElementById('hero-title').value = data.heroTitle || '';
      document.getElementById('hero-subtitle').value = data.heroSubtitle || '';
      
      // Section 1
      document.getElementById('s1-eyebrow').value = data.s1Eyebrow || '';
      document.getElementById('s1-title').value = data.s1Title || '';
      document.getElementById('s1-desc').value = data.s1Desc || '';
      
      // Section 2
      document.getElementById('s2-eyebrow').value = data.s2Eyebrow || '';
      document.getElementById('s2-title').value = data.s2Title || '';
      document.getElementById('s2-desc').value = data.s2Desc || '';
      
      // Section 3 (Benefits)
      document.getElementById('s3-eyebrow').value = data.s3Eyebrow || '';
      document.getElementById('s3-title').value = data.s3Title || '';
      document.getElementById('s3-desc').value = data.s3Desc || '';
      
      // Footer
      document.getElementById('footer-desc').value = data.footerDesc || '';
      document.getElementById('footer-email').value = data.footerEmail || '';
      document.getElementById('footer-phone').value = data.footerPhone || '';
    }
  } catch (error) {
    console.error("Error loading content: ", error);
  }
}

contentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('save-content-btn');
  btn.textContent = 'Saving...';
  
  const contentData = {
    logoText: document.getElementById('logo-text').value,
    videoUrl: document.getElementById('video-url').value,
    
    heroTitle: document.getElementById('hero-title').value,
    heroSubtitle: document.getElementById('hero-subtitle').value,
    
    s1Eyebrow: document.getElementById('s1-eyebrow').value,
    s1Title: document.getElementById('s1-title').value,
    s1Desc: document.getElementById('s1-desc').value,
    
    s2Eyebrow: document.getElementById('s2-eyebrow').value,
    s2Title: document.getElementById('s2-title').value,
    s2Desc: document.getElementById('s2-desc').value,
    
    s3Eyebrow: document.getElementById('s3-eyebrow').value,
    s3Title: document.getElementById('s3-title').value,
    s3Desc: document.getElementById('s3-desc').value,
    
    footerDesc: document.getElementById('footer-desc').value,
    footerEmail: document.getElementById('footer-email').value,
    footerPhone: document.getElementById('footer-phone').value
  };

  try {
    await setDoc(doc(db, "content", "home"), contentData, { merge: true });
    contentSuccess.style.color = '#C8A45C'; // Use brand gold for success
    contentSuccess.textContent = 'Content saved successfully!';
    setTimeout(() => contentSuccess.textContent = '', 3000);
  } catch (error) {
    console.error("Error saving content: ", error);
    contentSuccess.style.color = 'red';
    contentSuccess.textContent = 'Error saving content: ' + error.message;
  } finally {
    btn.textContent = 'Save Changes';
  }
});

// ==========================================
// Initial Data Seeding (One-time use)
// ==========================================
const seedBtn = document.getElementById('seed-db-btn');
if (seedBtn) {
  seedBtn.addEventListener('click', async () => {
    if (!confirm("This will overwrite your database with the default website text and products. Are you sure?")) return;
    
    seedBtn.textContent = "Loading...";
    seedBtn.disabled = true;

    try {
      // Check if products already exist to prevent duplication
      const existingProducts = await getDocs(collection(db, "products"));
      if (!existingProducts.empty) {
        alert("Data is already loaded! If you want to load it again, please delete the existing products first.");
        seedBtn.textContent = "Load Current Website Data";
        seedBtn.disabled = false;
        return;
      }

      // 1. Seed Products
      const defaultProducts = [
        {
          name: "Simple Black Coffee",
          price: "350",
          description: "Pure, bold, and unapologetic. A single-origin pour, brewed black with no additions — sharp clarity in every sip.",
          image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&fit=crop",
          badge: "Classic"
        },
        {
          name: "Cappuccino",
          price: "480",
          description: "Equal parts espresso, steamed milk, and velvety foam — balanced and smooth, finished with hand-poured latte art.",
          image: "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=600&q=80&fit=crop",
          badge: "Best Seller"
        },
        {
          name: "Cold Coffee",
          price: "420",
          description: "Chilled, blended, and poured over ice. Cold milk, fresh coffee, and a smooth finish — the perfect summer ritual.",
          image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80&fit=crop",
          badge: "Chilled"
        },
        {
          name: "Espresso",
          price: "320",
          description: "A concentrated shot of our signature dark roast. Thick crema, intense aroma, and a lingering dark chocolate finish.",
          image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80&fit=crop",
          badge: "Intense"
        },
        {
          name: "Latte",
          price: "450",
          description: "A delicate balance of light espresso and plenty of steamed milk. Mild, comforting, and perfect for slow mornings.",
          image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&q=80&fit=crop",
          badge: ""
        }
      ];

      for (const p of defaultProducts) {
        await addDoc(collection(db, "products"), p);
      }

      // 2. Seed Content
      const defaultContent = {
        logoText: "Coffeep<span class=\"accent-dot\">io</span>",
        videoUrl: "coffee1.mp4",
        heroTitle: "Awaken<br><span class=\"gold\">Your Senses</span>",
        heroSubtitle: "Weight in the cup. Warmth on the skin. The quiet first breath of steam before the day begins.",
        s1Eyebrow: "I — THE BEAN",
        s1Title: "<span class=\"w\">Sourced for the</span><br><span class=\"g\">Perfect Roast</span>",
        s1Desc: "Every batch is selected by hand, roasted in small drums, and rested before grinding — never assembly, always craft. Coffeepio works directly with growers so the bean reaches you within days of roasting, not months.",
        s2Eyebrow: "II — THE BREW",
        s2Title: "<span class=\"w\">Experience</span><br><span class=\"g\">the Warmth</span>",
        s2Desc: "From a sharp, focused espresso to a slow, milk-soft latte — each cup is pulled to order and finished by hand, so what reaches your table tastes exactly the way it should.",
        s3Eyebrow: "WHY COFFEE",
        s3Title: "<span class=\"w\">Good for the Mind.</span><br><span class=\"g\">Better for the Morning.</span>",
        s3Desc: "Beyond the ritual, every cup carries real, well-documented benefits — drawn from real beans and real leaves, not shortcuts.",
        footerDesc: "Small-batch coffee, roasted in ritual. Five signature brews, made fresh to order, every single time.",
        footerEmail: "hello@coffeepio.pk",
        footerPhone: "+92 300 1234567"
      };

      await setDoc(doc(db, "content", "home"), defaultContent);

      alert("Data Loaded Successfully! The page will now refresh.");
      window.location.reload();
      
    } catch (error) {
      console.error(error);
      alert("Error loading data: " + error.message);
    } finally {
      seedBtn.textContent = "Load Current Website Data";
      seedBtn.disabled = false;
    }
  });
}
