const URL_CLOUD = "Uhttps://script.google.com/macros/s/AKfycbyn05XxL6r0KVfs9H8a0OxEdJ1z4YZ-kxr0Lbwfi8ksHyATXFsk3RWwgIQ27TTtYPjegA/exec";
let dataMaster = {}, currentUser = null, jawaban = {};

window.onload = async () => {
    const res = await fetch(URL_CLOUD);
    dataMaster = await res.json();
    document.getElementById('loader').style.display = "none";
};

function nav(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('p-' + id).style.display = 'block';
    if(id.includes('admin')) renderAdminData(id);
}

function prosesLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(u === 'admin' && p === 'admin123') {
        currentUser = { nama: 'Administrator', role: 'ADMIN' };
        document.querySelector('.admin-only').style.display = 'block';
        nav('admin-rekap');
    } else {
        const s = dataMaster.siswa.find(x => x.user == u && x.pass == p);
        if(!s || s.blokir == 'YA') return alert("Login Gagal!");
        currentUser = { nama: s.nama, role: 'SISWA', user: u };
        document.querySelector('.admin-only').style.display = 'none';
        nav('ujian');
    }
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    document.getElementById('user-tag').innerText = currentUser.nama;
}

async function simpanSoal() {
    const body = { type: "ADD_SOAL", mapel: "UMUM", tipe: document.getElementById('s-tipe').value, tanya: document.getElementById('s-tanya').value, A: document.getElementById('s-a').value, B: document.getElementById('s-b').value, C: document.getElementById('s-c').value, D: document.getElementById('s-d').value, kunci: document.getElementById('s-kunci').value };
    await fetch(URL_CLOUD, { method: 'POST', body: JSON.stringify(body) });
    alert("Soal Tersimpan!"); location.reload();
}

async function simpanSiswa() {
    const body = { type: "ADD_SISWA", nama: document.getElementById('sis-nama').value, user: document.getElementById('sis-user').value, pass: document.getElementById('sis-pass').value };
    await fetch(URL_CLOUD, { method: 'POST', body: JSON.stringify(body) });
    alert("Siswa Terdaftar!"); location.reload();
}

async function simpanConfig() {
    const body = { type: "SET_CONFIG", token: document.getElementById('cfg-token').value, durasi: document.getElementById('cfg-durasi').value };
    await fetch(URL_CLOUD, { method: 'POST', body: JSON.stringify(body) });
    alert("Config Updated!"); location.reload();
}

function renderAdminData(id) {
    if(id === 'admin-rekap') {
        document.querySelector('#t-hasil tbody').innerHTML = dataMaster.hasil.map(h => `<tr><td>${h.nama}</td><td>${h.skor}</td><td>${h.waktu}</td></tr>`).join('');
    } else if (id === 'admin-siswa') {
        document.querySelector('#t-siswa tbody').innerHTML = dataMaster.siswa.map(s => `<tr><td>${s.nama}</td><td>${s.blokir}</td><td><button onclick="alert('Gunakan Google Sheets untuk Reset')">Edit</button></td></tr>`).join('');
    }
}