// ---------------- FIREBASE ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOuvOsfWWndciAFZZ_e5OticoSdmfYnsc",
    authDomain: "xspotify-67a78.firebaseapp.com",
    projectId: "xspotify-67a78",
    storageBucket: "xspotify-67a78.appspot.com",
    messagingSenderId: "192881320098",
    appId: "1:192881320098:web:dde7f143f68a30c23437fb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.login = function () {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then(() => alert("Logado!"))
        .catch(e => alert(e.message));
};

window.register = function () {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    createUserWithEmailAndPassword(auth, email, senha)
        .then(() => alert("Conta criada!"))
        .catch(e => alert(e.message));
};


// ---------------- SUPABASE ----------------
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://hwgzbvxhoamxwodhqusl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z3pidnhob2FteHdvZGhxdXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODM2MjUsImV4cCI6MjA3OTI1OTYyNX0.9U8lFXtGgRYR0QHZDtnmXrxcEshJhxmVDilwIfHxdnE";

const supabase = createClient(supabaseUrl, supabaseKey);


// ---------------- UPLOAD MÚSICA ----------------
window.uploadMusic = async function () {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {
        status.innerText = "Selecione um arquivo!";
        return;
    }

    const file = fileInput.files[0];
    status.innerText = "Enviando...";

    const path = `uploads/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage.from("musicas").upload(path, file);

    if (error) {
        status.innerText = "Erro ao enviar: " + error.message;
        return;
    }

    status.innerText = "Música enviada!";

    loadMusics(); // recarrega lista
};


// ---------------- CARREGAR MÚSICAS NA HOME ----------------
async function loadMusics() {
    const playlistDiv = document.getElementById("playlist");
    if (!playlistDiv) return;

    playlistDiv.innerHTML = "Carregando...";

    const { data, error } = await supabase
        .storage
        .from("musicas")
        .list("uploads", { limit: 100 });

    if (error) {
        playlistDiv.innerHTML = "Erro ao carregar músicas.";
        return;
    }

    playlistDiv.innerHTML = "";

    data.forEach(file => {
        const fileName = file.name;
        const url = supabase.storage.from("musicas").getPublicUrl(`uploads/${fileName}`).data.publicUrl;

        const item = document.createElement("div");
        item.classList.add("music-item");

        item.innerHTML = `
            <p>${fileName}</p>
            <button onclick="playMusic('${url}')">▶️ Tocar</button>
        `;

        playlistDiv.appendChild(item);
    });
}


// ---------------- PLAYER ----------------
window.playMusic = function (url) {
    const audio = document.getElementById("audioPlayer");
    const title = document.getElementById("player-title");

    audio.src = url;
    audio.play();

    title.innerText = "Tocando: " + url.split("/").pop();
};


// carregar automaticamente no index
if (location.pathname.includes("index.html") || location.pathname === "/") {
    loadMusics();
}
