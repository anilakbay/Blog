// Gerekli modülleri yükle
require("dotenv").config(); // .env dosyasındaki ortam değişkenlerini kullan

const express = require("express"); // Express.js framework
const expressLayout = require("express-ejs-layouts"); // EJS için düzen desteği
const methodOverride = require("method-override"); // HTTP metodlarını (PUT, DELETE) kullanabilmek için
const cookieParser = require("cookie-parser"); // Cookie işleme için
const session = require("express-session"); // Oturum yönetimi için
const MongoStore = require("connect-mongo"); // MongoDB ile oturumları saklamak için

const connectDB = require("./server/config/db"); // Veritabanı bağlantı fonksiyonu
const { isActiveRoute } = require("./server/helpers/routeHelpers"); // Route yardımcı fonksiyonu

const app = express(); // Express uygulamasını oluştur
const PORT = process.env.PORT || 5000; // Port ayarı (ortam değişkeni veya 5000)

// MongoDB'ye bağlan
connectDB();

// Middleware'leri tanımla
app.use(express.urlencoded({ extended: true })); // URL encoded verileri işlemek için
app.use(express.json()); // JSON verileri işlemek için
app.use(cookieParser()); // Cookie'leri kullanabilmek için
app.use(methodOverride("_method")); // Formlarda _method alanını kullanarak PUT/DELETE isteği yapmak için

// Oturum yönetimi
app.use(
  session({
    secret: "keyboard cat", // Gizli anahtar
    resave: false, // Her istekte oturumu tekrar kaydetme
    saveUninitialized: true, // Yeni oturumları kaydet
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // MongoDB bağlantı dizesi
    }),
    //cookie: { maxAge: new Date(Date.now() + (3600000)) } // (isteğe bağlı) Cookie ömrü ayarı
  })
);

app.use(express.static("public")); // Statik dosyaları servis et

// Templating Engine ayarları
app.use(expressLayout); // EJS düzenini kullan
app.set("layout", "./layouts/main"); // Ana düzen dosyası
app.set("view engine", "ejs"); // Görünüm motoru EJS olarak ayarlanır

app.locals.isActiveRoute = isActiveRoute; // Route helper'ı yerel değişken olarak ayarla

// Route'ları yükle
app.use("/", require("./server/routes/main")); // Ana route
app.use("/", require("./server/routes/admin")); // Yönetim paneli route'u

// Uygulamayı dinle ve belirtilen portta başlat
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // Başlatıldığında konsola mesaj yaz
});
