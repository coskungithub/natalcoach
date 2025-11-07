# 🧪 Natal Coach Test Rehberi

## Hızlı Başlangıç

### 1. Sunucuyu Başlatın
```bash
npm start
```

Çıktı: `🌟 Natal Coach sunucusu http://localhost:3000 adresinde çalışıyor`

---

## Test Yöntemleri

### ✅ Test 1: API Sağlık Kontrolü

```bash
curl http://localhost:3000/api/test
```

**Beklenen Sonuç:**
```json
{"message":"Natal Coach API çalışıyor!","version":"1.0.0"}
```

---

### ✅ Test 2: Basit Natal Harita Hesaplama

```bash
curl -X POST http://localhost:3000/api/natal-chart \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1990,
    "month": 6,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "latitude": 41.0082,
    "longitude": 28.9784
  }'
```

**Beklenen Sonuç:**
- `success: true`
- Tüm gezegen pozisyonları
- 12 ev pozisyonu
- Yükselen ve MC bilgisi

---

### ✅ Test 3: Web Arayüzü (Tarayıcı)

1. Tarayıcınızı açın
2. `http://localhost:3000` adresine gidin
3. Formu doldurun:
   - **Tarih**: Örn: 15/06/1990
   - **Saat**: Örn: 14:30
   - **Enlem**: 41.0082 (İstanbul)
   - **Boylam**: 28.9784 (İstanbul)
4. "Haritayı Hesapla" butonuna tıklayın

**Beklenen Sonuç:**
- Yükselen burç ve MC kartları görünmeli
- 11 gezegen pozisyonu görünmeli
- 12 ev başlangıcı görünmeli

---

### ✅ Test 4: Otomatik Test Script

```bash
chmod +x test-api.sh
./test-api.sh
```

Bu script 4 farklı senaryoyu otomatik test eder.

---

## Test Senaryoları

### Senaryo 1: Farklı Şehirler

**İstanbul:**
```json
{"latitude": 41.0082, "longitude": 28.9784}
```

**Ankara:**
```json
{"latitude": 39.9334, "longitude": 32.8597}
```

**İzmir:**
```json
{"latitude": 38.4237, "longitude": 27.1428}
```

**Antalya:**
```json
{"latitude": 36.8969, "longitude": 30.7133}
```

### Senaryo 2: Farklı Dönemler

**1970'ler:**
```json
{"year": 1975, "month": 8, "day": 20}
```

**1980'ler:**
```json
{"year": 1985, "month": 12, "day": 25}
```

**1990'lar:**
```json
{"year": 1995, "month": 3, "day": 10}
```

**2000'ler:**
```json
{"year": 2005, "month": 7, "day": 5}
```

### Senaryo 3: Gece Yarısı / Öğlen

**Gece Yarısı:**
```json
{"hour": 0, "minute": 0}
```

**Öğlen:**
```json
{"hour": 12, "minute": 0}
```

**Akşam:**
```json
{"hour": 18, "minute": 30}
```

---

## Hata Testleri

### Eksik Parametre
```bash
curl -X POST http://localhost:3000/api/natal-chart \
  -H "Content-Type: application/json" \
  -d '{"year": 1990}'
```

**Beklenen Hata:**
```json
{"error": "Tüm alanları doldurun: ..."}
```

### Geçersiz Tarih
```bash
curl -X POST http://localhost:3000/api/natal-chart \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1990,
    "month": 13,
    "day": 32,
    "hour": 25,
    "minute": 70,
    "latitude": 41.0082,
    "longitude": 28.9784
  }'
```

---

## Performans Testi

### Çoklu İstek Testi
```bash
for i in {1..10}; do
  echo "Test $i:"
  time curl -s -X POST http://localhost:3000/api/natal-chart \
    -H "Content-Type: application/json" \
    -d '{
      "year": 1990,
      "month": 6,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "latitude": 41.0082,
      "longitude": 28.9784
    }' > /dev/null
done
```

---

## Doğrulama

Sonuçları doğrulamak için:
- [Astro.com](https://www.astro.com/horoscope) ile karşılaştırın
- [AstroSeek](https://www.astroseek.com/birth-chart-calculator) ile kontrol edin

---

## Sorun Giderme

### Port 3000 Kullanımda
```bash
# Kullanılan portu kontrol et
lsof -i :3000

# Süreci sonlandır
kill -9 <PID>
```

### Node Modülleri Eksik
```bash
rm -rf node_modules package-lock.json
npm install
```

### Ephemeris Dosyaları
Swiss Ephemeris, gerekli dosyaları otomatik olarak indirir.
İnternet bağlantınızın olduğundan emin olun.

---

## Başarı Kriterleri

✅ API `/test` endpoint'i yanıt veriyor
✅ Natal harita hesaplaması başarılı
✅ Tüm 11 gezegen pozisyonu hesaplanıyor
✅ 12 ev hesaplanıyor
✅ Yükselen ve MC doğru hesaplanıyor
✅ Web arayüzü açılıyor ve form çalışıyor
✅ Sonuçlar görsel olarak gösteriliyor
✅ Hata mesajları doğru gösteriliyor

---

## İleri Seviye Testler

### JSON Schema Validation
```bash
npm install -g ajv-cli
ajv validate -s natal-chart-schema.json -d response.json
```

### Load Testing
```bash
npm install -g loadtest
loadtest -c 10 -n 100 http://localhost:3000/api/natal-chart \
  -T application/json \
  -m POST \
  -P '{"year":1990,"month":6,"day":15,"hour":14,"minute":30,"latitude":41.0082,"longitude":28.9784}'
```

---

## Test Checklist

- [ ] Sunucu başlatıldı
- [ ] API test endpoint çalışıyor
- [ ] Natal harita hesaplaması çalışıyor
- [ ] Web arayüzü erişilebilir
- [ ] Form gönderimi çalışıyor
- [ ] Sonuçlar doğru gösteriliyor
- [ ] Hata durumları doğru yönetiliyor
- [ ] Farklı tarihler test edildi
- [ ] Farklı lokasyonlar test edildi
- [ ] Otomatik test script çalıştırıldı
