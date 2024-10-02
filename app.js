require("dotenv").config(); // .env dosyasını yükle, böylece çevresel değişkenler kullanılabilir hale gelir

const express = require("express"); // Express'i projeye dahil et
const expressLayout = require("express-ejs-layouts"); // EJS Layouts'i projeye dahil et

const connectDB = require("./server/config/db"); // Veritabanı baglantısını projeye dahil et

const app = express(); // Express uygulamasını oluştur
const PORT = process.env.PORT || 5000;

connectDB(); // Port numarasını belirle, eğer ortam değişkeni yoksa 5000'i kullan

app.use(express.static("public")); // "public" klasöründeki statik dosyaları sun

// Templating Engine ayarları
app.use(expressLayout); // EJS Layouts middleware'ini kullan
app.set("layout", "./layouts/main"); // Ana düzen dosyasını belirle
app.set("view engine", "ejs"); // Görünüm motoru olarak EJS'i ayarla

app.use("/", require("./server/routes/main")); //Ana yol için main yönlendiricisinden gelen istekleri işler.

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // Sunucu çalıştığında port numarasını göster
});
