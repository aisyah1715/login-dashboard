// DARK MODE
const toggleDark = document.getElementById("toggleDark");
toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
  localStorage.setItem("darkMode", this.checked);
});
window.addEventListener("load", () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", isDark);
  toggleDark.checked = isDark;
});

// CRUD
let data = JSON.parse(localStorage.getItem("produk")) || [];

function simpanData() {
  localStorage.setItem("produk", JSON.stringify(data));
}

function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function unformatRupiah(angkaStr) {
  return angkaStr.replace(/\./g, "");
}

function formatHargaInput(input) {
  let angka = input.value.replace(/\D/g, ""); // Hanya angka
  input.value = formatRupiah(angka);
}

function renderTable() {
  const tbody = document.querySelector("#tabelProduk tbody");
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const isEditing = item.editing || false;

    const row = document.createElement("tr");
    row.innerHTML = `
  <td><input type="text" id="nama-${index}" value="${item.nama}" ${isEditing ? "" : "disabled"}></td>
  <td><input type="text" id="harga-${index}" value="${formatRupiah(item.harga)}" 
      ${isEditing ? `oninput="formatHargaInput(this)"` : "disabled"}></td>
  <td>
    <button class="edit-btn" onclick="toggleEdit(${index})">${isEditing ? "Simpan" : "Edit"}</button>
    <button class="hapus-btn" onclick="hapusProduk(${index})">Hapus</button>
  </td>
`;

    tbody.appendChild(row);
  });
}

function toggleEdit(index) {
  const item = data[index];
  const isEditing = item.editing || false;

  if (isEditing) {
    const namaBaru = document.getElementById(`nama-${index}`).value;
    const hargaFormatted = document.getElementById(`harga-${index}`).value;
    const hargaBaru = unformatRupiah(hargaFormatted);

    data[index].nama = namaBaru;
    data[index].harga = hargaBaru;
    data[index].editing = false;
  } else {
    data[index].editing = true;
  }

  simpanData();
  renderTable();
}

function tambahProduk() {
  const nama = document.getElementById("namaProduk").value;
  const hargaFormatted = document.getElementById("hargaProduk").value;
  const harga = unformatRupiah(hargaFormatted);

  if (nama && harga) {
    data.push({ nama, harga, editing: false });
    simpanData();
    renderTable();
    document.getElementById("namaProduk").value = "";
    document.getElementById("hargaProduk").value = "";
  }
}

// Format input harga saat diketik di input awal
document.getElementById("hargaProduk").addEventListener("input", function () {
  formatHargaInput(this);
});

function hapusProduk(index) {
  if (confirm("Yakin ingin menghapus produk ini?")) {
    data.splice(index, 1);
    simpanData();
    renderTable();
  }
}

document.addEventListener("DOMContentLoaded", renderTable);

document.getElementById("logoutBtn").addEventListener("click", function () {
  // Hapus semua data login (contoh)
  localStorage.removeItem("isLoggedIn"); // sesuaikan jika nama berbeda
  localStorage.removeItem("user");       // atau item lain yang dipakai untuk sesi login

  // Redirect ke halaman login
  window.location.href = "login.html";  // ganti nama file sesuai dengan halaman login kamu
});
