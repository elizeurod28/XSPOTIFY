import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOuvOsfWWndciAFZZ_e5OticoSdmfYnsc",
    authDomain: "xspotify-67a78.firebaseapp.com",
    projectId: "xspotify-67a78",
    storageBucket: "xspotify-67a78.firebasestorage.app",
    messagingSenderId: "192881320098",
    appId: "1:192881320098:web:dde7f143f68a30c23437fb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.login = function() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    signInWithEmailAndPassword(auth, email, senha)
    .then(() => alert("Logado!"))
    .catch(e => alert(e.message));
};

window.register = function() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    createUserWithEmailAndPassword(auth, email, senha)
    .then(() => alert("Conta criada!"))
    .catch(e => alert(e.message));
};
