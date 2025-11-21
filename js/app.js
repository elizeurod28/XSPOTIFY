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
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://hwgzbvxhoamxwodhqusl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z3pidnhob2FteHdvZGhxdXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODM2MjUsImV4cCI6MjA3OTI1OTYyNX0.9U8lFXtGgRYR0QHZDtnmXrxcEshJhxmVDilwIfHxdnE";
const supabase = createClient(supabaseUrl, supabaseKey);

window.uploadMusic = async function () {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (fileInput.files.length === 0) {
        status.innerText = "Selecione um arquivo!";
        return;
    }

    const file = fileInput.files[0];

    status.innerText = "Enviando...";

    const { data, error } = await supabase
        .storage
        .from("musicas")
        .upload(`uploads/${Date.now()}_${file.name}`, file);

    if (error) {
        console.error(error);
        status.innerText = "Erro ao enviar!";
        return;
    }

    status.innerText = "Música enviada com sucesso!";
};
