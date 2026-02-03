const URL_CLOUD = "https://script.google.com/macros/s/AKfycbyn05XxL6r0KVfs9H8a0OxEdJ1z4YZ-kxr0Lbwfi8ksHyATXFsk3RWwgIQ27TTtYPjegA/exec"; //
let dataMaster = { soal: [], siswa: [], hasil: [], config: { token: "TKA26", durasi: 60 } };
let currentUser = null;
let jawabanSiswa = {};

window.onload = async () => {
    console.log("Memulai sinkronisasi...");
    try {
        const response = await fetch(URL_CLOUD);
        if (!response.ok) throw new Error("Respon Network Gagal");
        
        dataMaster = await response.json();
        console.log("Data berhasil dimuat:", dataMaster);
        
        // Sembunyikan Loader
        document.getElementById('loader').style.fadeOut = "slow";
        document.getElementById('loader').style.display = "none";
    } catch (error) {
        console.error("Gagal koneksi:", error);
        document.getElementById('loader').innerHTML = `
            <div style="text-align:center; padding:20px;">
                <i class="fas fa-exclamation-triangle fa-3x" style="color:red"></i>
                <p>Koneksi ke Database Gagal!</p>
                <button onclick="location.reload()" class="btn-main">Coba Lagi</button>
            </div>`;
    }
};

// Fungsi Navigasi
function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const targetPage = document.getElementById('p-' + id);
    if(targetPage) targetPage.style.display = 'block';
    
    const targetMenu = document.getElementById('m-' + id);
    if(targetMenu) targetMenu.classList.add('active');

    if(id.includes('admin')) renderAdminData(id);
}

// Fungsi Login
function prosesLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if(u === 'admin' && p === 'admin123') {
        currentUser = { nama: 'Administrator', role: 'ADMIN' };
        document.querySelector('.admin-only').style.display = 'block';
        nav('admin-rekap');
    } else {
        const s = dataMaster.siswa.find(x => x.user == u && x.pass == p);
        if(!s) return alert("User tidak ditemukan atau belum terdaftar!");
        if(s.blokir == 'YA') return alert("AKUN ANDA TERBLOKIR!");
        
        currentUser = { nama: s.nama, role: 'SISWA', user: u };
        document.querySelector('.admin-only').style.display = 'none';
        nav('ujian');
    }
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    document.getElementById('user-tag').innerText = currentUser.nama;
}
