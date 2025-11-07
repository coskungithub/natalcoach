document.getElementById('natalForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Form verilerini al
    const dateInput = document.getElementById('date').value;
    const timeInput = document.getElementById('time').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    // Debug: Koordinatları konsola yazdır
    console.log('Gönderilen koordinatlar:', { latitude, longitude });

    // Tarih ve saati parçala
    const [year, month, day] = dateInput.split('-').map(Number);
    const [hour, minute] = timeInput.split(':').map(Number);

    // UI güncellemeleri
    showLoading();
    hideError();
    hideResults();

    try {
        // Timezone seçimini al
        const timezoneSelect = document.getElementById('timezone').value;
        let timezoneOffset;

        if (timezoneSelect === 'auto') {
            // Otomatik: DOĞUM TARİHİ için offset hesapla
            // Bu, daylight saving time gibi tarihsel farklılıkları dikkate alır
            const birthDate = new Date(year, month - 1, day, hour, minute);
            timezoneOffset = birthDate.getTimezoneOffset();
            console.log('Otomatik timezone offset (doğum tarihi için):', timezoneOffset, 'dakika');
        } else {
            // Manuel seçim
            timezoneOffset = parseInt(timezoneSelect);
            console.log('Manuel timezone offset:', timezoneOffset, 'dakika');
        }

        // API çağrısı
        const response = await fetch('http://localhost:3000/api/natal-chart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year,
                month,
                day,
                hour,
                minute,
                latitude,
                longitude,
                timezoneOffset
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Bir hata oluştu');
        }

        // Debug: API'den gelen sonuçları konsola yazdır
        console.log('API Sonucu - ASC:', result.data.ascendant.degree, 'MC:', result.data.mc.degree);

        // Sonuçları göster
        displayResults(result.data);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
});

function displayResults(data) {
    // Natal Chart çiz
    drawNatalChart(data);

    // Burç sembolleri
    const zodiacSymbols = {
        'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋',
        'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏',
        'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
    };

    // Gezegen sembolleri
    const planetSymbols = {
        'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀',
        'Mars': '♂', 'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅',
        'Neptün': '♆', 'Plüton': '♇', 'Kuzey Düğüm': '☊'
    };

    // Yükselen burç
    const ascendantDiv = document.getElementById('ascendant');
    ascendantDiv.textContent = `${zodiacSymbols[data.ascendant.sign] || ''} ${formatDMS(data.ascendant.degreeInSign)}`;

    // MC
    const mcDiv = document.getElementById('mc');
    mcDiv.textContent = `${zodiacSymbols[data.mc.sign] || ''} ${formatDMS(data.mc.degreeInSign)}`;

    // Gezegenler
    const planetsDiv = document.getElementById('planets');
    planetsDiv.innerHTML = '';

    for (const [planetName, position] of Object.entries(data.planets)) {
        if (position.error) continue;

        const dataItem = document.createElement('div');
        dataItem.className = 'data-item';

        const planetSymbol = planetSymbols[planetName] || '?';
        const signSymbol = zodiacSymbols[position.sign] || '';
        const dms = formatDMS(position.degree);

        dataItem.textContent = `${planetSymbol} ${signSymbol} ${dms}`;
        planetsDiv.appendChild(dataItem);
    }

    // Evler
    const housesDiv = document.getElementById('houses');
    housesDiv.innerHTML = '';

    const signs = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

    data.houses.forEach((houseDegree, index) => {
        const dataItem = document.createElement('div');
        dataItem.className = 'data-item';

        const signIndex = Math.floor(houseDegree / 30);
        const degreeInSign = houseDegree % 30;
        const signSymbol = zodiacSymbols[signs[signIndex]] || '';
        const dms = formatDMS(degreeInSign);

        dataItem.textContent = `${index + 1}. Ev: ${signSymbol} ${dms}`;
        housesDiv.appendChild(dataItem);
    });

    showResults();
}

// Derece/Dakika/Saniye formatı
function formatDMS(degree) {
    const deg = Math.floor(degree);
    const minFloat = (degree - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.floor((minFloat - min) * 60);
    return `${deg}°${min.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}"`;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showResults() {
    document.getElementById('results').style.display = 'block';
}

function hideResults() {
    document.getElementById('results').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '❌ Hata: ' + message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Sayfa yüklendiğinde bugünün tarihini varsayılan olarak ayarla
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('date').value = dateStr;

    // Varsayılan saat: 12:00
    document.getElementById('time').value = '12:00';

    // Varsayılan konum: İstanbul
    document.getElementById('latitude').value = '41.0082';
    document.getElementById('longitude').value = '28.9784';
});
