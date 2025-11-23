# 🌟 Natal Coach

Astrolojik Doğum Haritası Hesaplama Web Uygulaması

Swiss Ephemeris kütüphanesi kullanılarak geliştirilmiş, doğum haritası (natal chart) hesaplama ve görüntüleme web uygulaması.

## ✨ Özellikler

- 🪐 Gezegen pozisyonları hesaplama (Güneş, Ay, Merkür, Venüs, Mars, Jüpiter, Satürn, Uranüs, Neptün, Plüton, Kuzey Düğüm)
- 🏠 12 Ev hesaplama (Placidus sistemi)
- ⬆️ Yükselen Burç (Ascendant) hesaplama
- ⭐ Orta Göğü (MC - Midheaven) hesaplama
- 🌍 Coğrafi konum desteği (enlem/boylam)
- 🎨 Modern ve responsive kullanıcı arayüzü
- 🇹🇷 Türkçe dil desteği

## 🚀 Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/coskungithub/natalcoach.git
cd natalcoach
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Sunucuyu başlatın:
```bash
npm start
```

4. Tarayıcınızda açın:
```
http://localhost:3000
```

## 📖 Kullanım

1. **Doğum Tarihi**: Doğum tarihinizi seçin
2. **Doğum Saati**: Doğum saatinizi girin (24 saat formatında)
3. **Enlem/Boylam**: Doğum yerinizin koordinatlarını girin
   - İstanbul için: Enlem 41.0082, Boylam 28.9784
   - Diğer şehirler için: [LatLong.net](https://www.latlong.net/)
4. **Hesapla**: "Haritayı Hesapla" butonuna tıklayın

## 🛠️ Teknolojiler

- **Backend**: Node.js, Express.js
- **Astroloji Hesaplamaları**: Swiss Ephemeris (swisseph npm paketi)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful API

## 📡 API Endpoints

### POST /api/natal-chart

Doğum haritası hesaplar.

**Request Body:**
```json
{
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "latitude": 41.0082,
  "longitude": 28.9784
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "planets": { ... },
    "houses": [ ... ],
    "ascendant": { ... },
    "mc": { ... }
  }
}
```

### GET /api/test

API sağlık kontrolü.

## 📝 Lisans

AGPL-3.0

## 🙏 Teşekkürler

- [Swiss Ephemeris](https://github.com/aloistr/swisseph) - Astroloji hesaplamaları için
- Astrodienst AG - Swiss Ephemeris'in geliştiricileri
