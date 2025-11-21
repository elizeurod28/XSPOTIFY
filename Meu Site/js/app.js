auth.onAuthStateChanged(user => {
    const protectedPages = ["index.html", "upload.html", "artist.html"];
    const path = window.location.pathname.split("/").pop();

    if (!user && protectedPages.includes(path)) {
        window.location.href = "login.html";
    }
});

// -------------------------------
// CONFIGURAÇÕES DO FIREBASE
// -------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyCOuvOsfWWndciAFZZ_e5OticoSdmfYnsc",
    authDomain: "xspotify-67a78.firebaseapp.com",
    projectId: "xspotify-67a78",
    storageBucket: "xspotify-67a78.firebasestorage.app",
    messagingSenderId: "192881320098",
    appId: "1:192881320098:web:dde7f143f68a30c23437fb"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


// -------------------------------
// CONFIGURAÇÕES DO SUPABASE
// -------------------------------

const SUPABASE_URL = "https://hwgzbvxhoamxwodhqusl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z3pidnhob2FteHdvZGhxdXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODM2MjUsImV4cCI6MjA3OTI1OTYyNX0.9U8lFXtGgRYR0QHZDtnmXrxcEshJhxmVDilwIfHxdnE";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// -------------------------------
// LOGIN
// -------------------------------

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Logado!");
        window.location.href = "index.html";
    } catch (e) {
        alert("Erro: " + e.message);
    }
}


// -------------------------------
// REGISTRO
// -------------------------------

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert("Conta criada!");
        window.location.href = "login.html";
    } catch (e) {
        alert("Erro: " + e.message);
    }
}

async function uploadMusic() {
    const file = document.getElementById("file").files[0];
    const name = document.getElementById("music-name").value;

    if (!file || name === "") {
        alert("Preencha tudo!");
        return;
    }

    // Upload Supabase
    const fileName = Date.now() + "_" + file.name;

    const { data, error } = await supabase.storage
        .from("musics")
        .upload(fileName, file);

    if (error) {
        alert("Erro no upload: " + error.message);
        return;
    }

    // URL pública
    const { data: urlData } = supabase.storage
        .from("musics")
        .getPublicUrl(fileName);

    const url = urlData.publicUrl;

    // Salvar no Firebase
    await db.collection("musics").add({
        name: name,
        url: url,
        cover: "assets/default.jpg",
        artistId: "default",
        createdAt: Date.now()
    });

    alert("Música enviada e salva no banco!");
}

// -------------------------------
// FIRESTORE
// -------------------------------
const db = firebase.firestore();

async function loadHome() {
    const playlistDiv = document.getElementById("playlist");
    if (!playlistDiv) return; // só carrega se for a home

    const snapshot = await db.collection("musics")
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

    playlistDiv.innerHTML = "";

    snapshot.forEach(doc => {
        const m = doc.data();
        playlistDiv.innerHTML += `
            <div class="music-card" onclick="playMusic('${m.url}', '${m.name}', '${m.cover}')">
                <img src="${m.cover}">
                <p>${m.name}</p>
            </div>
        `;
    });
}

loadHome();

async function loadArtist() {
    const artistDiv = document.getElementById("artist-tracks");
    if (!artistDiv) return;

    const snapshot = await db.collection("musics")
        .where("artistId", "==", "default")
        .get();

    artistDiv.innerHTML = "";

    snapshot.forEach(doc => {
        const m = doc.data();

        artistDiv.innerHTML += `
            <div class="music-card" onclick="playMusic('${m.url}', '${m.name}', '${m.cover}')">
                <img src="${m.cover}">
                <p>${m.name}</p>
            </div>
        `;
    });
}
