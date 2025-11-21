// ------------- FIREBASE ------------------
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

// ------------- LOGIN ------------------
window.login = function() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then(() => alert("Logado!"))
        .catch(e => alert(e.message));
};

// ------------- REGISTER ------------------
window.register = function() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    createUserWithEmailAndPassword(auth, email, senha)
        .then(() => alert("Conta criada!"))
        .catch(e => alert(e.message));
};


// ------------- SUPABASE UPLOAD ------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://hwgzbvxhoamxwodhqusl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z3pidnhob2FteHdvZGhxdXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODM2MjUsImV4cCI6MjA3OTI1OTYyNX0.9U8lFXtGgRYR0QHZDtnmXrxcEshJhxmVDilwIfHxdnE";
const supabase = createClient(supabaseUrl, supabaseKey);

window.uploadMusic = async function () {

    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput || !status) {
        alert("Erro: elemento não encontrado na página!");
        return;
    }

    if (fileInput.files.length === 0) {
        status.innerText = "Selecione um arquivo!";
        return;
    }

    const file = fileInput.files[0];
    status.innerText = "Enviando...";

    // ⚠️ Bucket deve existir no Supabase
    const { data, error } = await supabase
        .storage
        .from("musicas")
        .upload(`uploads/${Date.now()}_${file.name}`, file, {
            cacheControl: "3600",
            upsert: false
        });

    if (error) {
        console.error(error);
        status.innerText = "Erro ao enviar: " + error.message;
        return;
    }
    async function loadMusics() {
    const playlistDiv = document.getElementById("playlist");
    playlistDiv.innerHTML = "Carregando...";

    const { data, error } = await supabase
        .storage
        .from("musicas")
        .list("uploads", { limit: 100 });

    if (error) {
        console.error(error);
        playlistDiv.innerHTML = "Erro ao carregar músicas.";
        return;
    }

    playlistDiv.innerHTML = "";

    data.forEach(file => {
        const fileName = file.name;

        // Criar item da playlist
        const item = document.createElement("div");
        item.classList.add("music-item");

        item.innerHTML = `
            <p>${fileName}</p>
            <button onclick="playMusic('${fileName}')">▶️ Tocar</button>
        `;

        playlistDiv.appendChild(item);
    });
}

// Função para tocar música
async function playMusic(fileName) {
    const { data } = supabase
        .storage
        .from("musicas")
        .getPublicUrl(`uploads/${fileName}`);

    const audio = document.getElementById("audioPlayer");
    audio.src = data.publicUrl;
    audio.play();
}

// Carregar músicas automaticamente ao abrir a página
if (window.location.pathname.includes("index.html")) {
    loadMusics();
}


    status.innerText = "Música enviada com sucesso!";
};
