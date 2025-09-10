// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB7HnwfiV8EPdi7QWDc8cd2muFjLJhQVZc",
  authDomain: "passwordaty.firebaseapp.com",
  projectId: "passwordaty",
  storageBucket: "passwordaty.appspot.com",
  messagingSenderId: "50790211539",
  appId: "1:50790211539:web:d93f1a2cd59b849a345926",
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// تسجيل الدخول
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("تم تسجيل الدخول بنجاح ✅"))
    .catch(err => alert("خطأ: " + err.message));
}

// إنشاء حساب
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("تم إنشاء الحساب بنجاح 🎉"))
    .catch(err => alert("خطأ: " + err.message));
}
