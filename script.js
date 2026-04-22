// 1. Mengisi tanggal hari ini secara otomatis saat halaman dimuat
window.onload = function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('date').value = today;
};

// 2. Format Ribuan Otomatis
function formatRibuan(input) {
    if (!input || !input.value) return; // Mencegah error jika kosong
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    convertToWords();
}

// 3. Mengubah Angka menjadi Huruf (Terbilang)
function terbilang(angka) {
    var bilangan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    var temp = "";
    if (angka < 12) {
        temp = " " + bilangan[angka];
    } else if (angka < 20) {
        temp = terbilang(angka - 10) + " Belas";
    } else if (angka < 100) {
        temp = terbilang(Math.floor(angka / 10)) + " Puluh" + terbilang(angka % 10);
    } else if (angka < 200) {
        temp = " Seratus" + terbilang(angka - 100);
    } else if (angka < 1000) {
        temp = terbilang(Math.floor(angka / 100)) + " Ratus" + terbilang(angka % 100);
    } else if (angka < 2000) {
        temp = " Seribu" + terbilang(angka - 1000);
    } else if (angka < 1000000) {
        temp = terbilang(Math.floor(angka / 1000)) + " Ribu" + terbilang(angka % 1000);
    } else if (angka < 1000000000) {
        temp = terbilang(Math.floor(angka / 1000000)) + " Juta" + terbilang(angka % 1000000);
    } else if (angka < 1000000000000) { 
        temp = terbilang(Math.floor(angka / 1000000000)) + " Milyar" + terbilang(angka % 1000000000);
    } else if (angka < 1000000000000000) { 
        temp = terbilang(Math.floor(angka / 1000000000000)) + " Triliun" + terbilang(angka % 1000000000000);
    }
    return temp;
}

// 4. Menerapkan hasil terbilang ke textarea Words
function convertToWords() {
    var amountInput = document.getElementById('amount').value;
    var amountVal = amountInput.replace(/\./g, '');
    var wordsField = document.getElementById('words');
    
    if (amountVal && amountVal > 0) {
        var hasil = terbilang(amountVal).trim() + " Rupiah";
        wordsField.value = hasil.charAt(0).toUpperCase() + hasil.slice(1);
    } else {
        wordsField.value = "";
    }
}

// 5. Menyalin data ke Template Cetak dan Membuka Print Dialog
function prepareAndPrint() {
    // A. Perbaikan Format Tanggal
    var dateVal = document.getElementById('date').value; 
    var dateParts = dateVal.split('-');
    
    if (dateParts.length === 3) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var year = dateParts[0];
        var month = parseInt(dateParts[1], 10) - 1; 
        var day = parseInt(dateParts[2], 10);
        var formattedDate = day + " " + months[month] + " " + year;
        document.getElementById('print-date').innerText = formattedDate;
    } else {
        document.getElementById('print-date').innerText = dateVal;
    }
    
    // B. Pemicu Ulang untuk Words (Jaga-jaga jika copy-paste angka)
    formatRibuan(document.getElementById('amount'));

    // C. Salin Data Teks ke Template
    document.getElementById('print-payTo').innerText = document.getElementById('payTo').value;
    document.getElementById('print-for').innerText = document.getElementById('forPurpose').value;
    document.getElementById('print-amount').innerText = document.getElementById('amount').value;
    document.getElementById('print-words').innerText = document.getElementById('words').value;
    
    // D. Salin Charge To (Menjaga enter / baris baru)
    var chargeText = document.getElementById('chargeTo').value;
    if(chargeText.trim() === "") {
        chargeText = "Account\nRsce/etc\nFnct/Who/etc"; // Default jika tidak diisi
    }
    document.getElementById('print-charge').innerText = chargeText;

    // E. Salin Checkbox Cash / Transfer
    var method = document.querySelector('input[name="paymentMethod"]:checked');
    document.getElementById('box-cash').innerHTML = (method && method.value === 'cash') ? '&#10003;' : '';
    document.getElementById('box-transfer').innerHTML = (method && method.value === 'transfer') ? '&#10003;' : '';

    // F. Buka Print Dialog
    setTimeout(function() {
        window.print();
    }, 300); 
}
