const express = require('express');
const cors = require('cors');
const swisseph = require('swisseph');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Swiss Ephemeris dosya yolunu ayarla
swisseph.swe_set_ephe_path(__dirname + '/ephemeris');

// Burç sembolleri
const zodiacSigns = [
    'Koç', 'Boğa', 'İkizler', 'Yengeç',
    'Aslan', 'Başak', 'Terazi', 'Akrep',
    'Yay', 'Oğlak', 'Kova', 'Balık'
];

// Gezegen isimleri
const planetNames = {
    0: 'Güneş',
    1: 'Ay',
    2: 'Merkür',
    3: 'Venüs',
    4: 'Mars',
    5: 'Jüpiter',
    6: 'Satürn',
    7: 'Uranüs',
    8: 'Neptün',
    9: 'Plüton',
    11: 'Kuzey Düğüm'
};

// Tarih ve saati Julian Date'e çevir
function getJulianDate(year, month, day, hour, minute) {
    const decimal_time = hour + minute / 60.0;
    const result = swisseph.swe_julday(
        year,
        month,
        day,
        decimal_time,
        swisseph.SE_GREG_CAL
    );
    return result;
}

// Gezegen pozisyonunu hesapla
function getPlanetPosition(julianDate, planetId) {
    const result = swisseph.swe_calc_ut(
        julianDate,
        planetId,
        swisseph.SEFLG_SWIEPH
    );

    if (result.error) {
        return { error: result.error };
    }

    const longitude = result.longitude;
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;

    return {
        longitude: longitude,
        sign: zodiacSigns[signIndex],
        signIndex: signIndex,
        degree: degreeInSign,
        latitude: result.latitude,
        distance: result.distance,
        speedLongitude: result.longitudeSpeed
    };
}

// Ev hesaplama
function calculateHouses(julianDate, latitude, longitude) {
    const result = swisseph.swe_houses(
        julianDate,
        latitude,
        longitude,
        'P' // Placidus ev sistemi
    );

    if (result.error) {
        return { error: result.error };
    }

    return {
        houses: result.house,
        ascendant: result.ascendant,
        mc: result.mc,
        armc: result.armc,
        vertex: result.vertex
    };
}

// API Endpoints

// Natal harita hesaplama
app.post('/api/natal-chart', (req, res) => {
    try {
        const { year, month, day, hour, minute, latitude, longitude } = req.body;

        // Validasyon
        if (!year || !month || !day || hour === undefined || minute === undefined || !latitude || !longitude) {
            return res.status(400).json({
                error: 'Tüm alanları doldurun: year, month, day, hour, minute, latitude, longitude'
            });
        }

        // Julian Date hesapla
        const julianDate = getJulianDate(year, month, day, hour, minute);

        // Gezegen pozisyonlarını hesapla
        const planets = {};
        const planetIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11]; // Güneş'ten Plüton'a + Kuzey Düğüm

        planetIds.forEach(id => {
            const position = getPlanetPosition(julianDate, id);
            planets[planetNames[id]] = position;
        });

        // Evleri hesapla
        const houses = calculateHouses(julianDate, latitude, longitude);

        // Yükselen burç (Ascendant)
        const ascendantSign = zodiacSigns[Math.floor(houses.ascendant / 30)];
        const ascendantDegree = houses.ascendant % 30;

        // Orta Göğü (MC)
        const mcSign = zodiacSigns[Math.floor(houses.mc / 30)];
        const mcDegree = houses.mc % 30;

        res.json({
            success: true,
            data: {
                birthData: {
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    latitude,
                    longitude
                },
                julianDate,
                planets,
                houses: houses.houses,
                ascendant: {
                    degree: houses.ascendant,
                    sign: ascendantSign,
                    degreeInSign: ascendantDegree
                },
                mc: {
                    degree: houses.mc,
                    sign: mcSign,
                    degreeInSign: mcDegree
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Hesaplama sırasında hata oluştu',
            details: error.message
        });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Natal Coach API çalışıyor!',
        version: '1.0.0'
    });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌟 Natal Coach sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
