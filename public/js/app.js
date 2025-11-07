document.getElementById('natalForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Form verilerini al
    const dateInput = document.getElementById('date').value;
    const timeInput = document.getElementById('time').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    // Tarih ve saati parçala
    const [year, month, day] = dateInput.split('-').map(Number);
    const [hour, minute] = timeInput.split(':').map(Number);

    // UI güncellemeleri
    showLoading();
    hideError();
    hideResults();

    try {
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
                longitude
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Bir hata oluştu');
        }

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
    // Yükselen burç
    const ascendantDiv = document.getElementById('ascendant');
    ascendantDiv.innerHTML = `
        <strong>${data.ascendant.sign}</strong><br>
        ${formatDegree(data.ascendant.degreeInSign)}
    `;

    // MC
    const mcDiv = document.getElementById('mc');
    mcDiv.innerHTML = `
        <strong>${data.mc.sign}</strong><br>
        ${formatDegree(data.mc.degreeInSign)}
    `;

    // Gezegenler
    const planetsDiv = document.getElementById('planets');
    planetsDiv.innerHTML = '';

    for (const [planetName, position] of Object.entries(data.planets)) {
        if (position.error) continue;

        const planetCard = document.createElement('div');
        planetCard.className = 'planet-card';
        planetCard.innerHTML = `
            <div class="planet-name">${planetName}</div>
            <div class="planet-info">
                ${position.sign}<br>
                ${formatDegree(position.degree)}
            </div>
        `;
        planetsDiv.appendChild(planetCard);
    }

    // Evler
    const housesDiv = document.getElementById('houses');
    housesDiv.innerHTML = '';

    data.houses.forEach((houseDegree, index) => {
        const houseCard = document.createElement('div');
        houseCard.className = 'house-card';

        const signIndex = Math.floor(houseDegree / 30);
        const degreeInSign = houseDegree % 30;
        const signs = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

        houseCard.innerHTML = `
            <div class="house-number">Ev ${index + 1}</div>
            <div class="house-degree">
                ${signs[signIndex]}<br>
                ${formatDegree(degreeInSign)}
            </div>
        `;
        housesDiv.appendChild(houseCard);
    });

    showResults();
}

function formatDegree(degree) {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    return `${deg}° ${min}'`;
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
