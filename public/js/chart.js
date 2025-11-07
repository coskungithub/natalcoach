// Chart çizim sınıfı
class NatalChart {
    constructor(canvasId, data) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = data;

        // Canvas boyutları
        this.width = 800;
        this.height = 800;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Merkez ve yarıçaplar
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.outerRadius = 380;
        this.zodiacRadius = 340;
        this.houseRadius = 280;
        this.planetRadius = 240;
        this.aspectRadius = 180;

        // Renkler
        this.colors = {
            fire: '#FF6B6B',      // Ateş: Koç, Aslan, Yay
            earth: '#4ECDC4',     // Toprak: Boğa, Başak, Oğlak
            air: '#FFE66D',       // Hava: İkizler, Terazi, Kova
            water: '#95E1D3'      // Su: Yengeç, Akrep, Balık
        };

        // Burç bilgileri
        this.zodiacSigns = [
            { name: 'Koç', symbol: '♈', element: 'fire' },
            { name: 'Boğa', symbol: '♉', element: 'earth' },
            { name: 'İkizler', symbol: '♊', element: 'air' },
            { name: 'Yengeç', symbol: '♋', element: 'water' },
            { name: 'Aslan', symbol: '♌', element: 'fire' },
            { name: 'Başak', symbol: '♍', element: 'earth' },
            { name: 'Terazi', symbol: '♎', element: 'air' },
            { name: 'Akrep', symbol: '♏', element: 'water' },
            { name: 'Yay', symbol: '♐', element: 'fire' },
            { name: 'Oğlak', symbol: '♑', element: 'earth' },
            { name: 'Kova', symbol: '♒', element: 'air' },
            { name: 'Balık', symbol: '♓', element: 'water' }
        ];

        // Gezegen sembolleri
        this.planetSymbols = {
            'Güneş': '☉',
            'Ay': '☽',
            'Merkür': '☿',
            'Venüs': '♀',
            'Mars': '♂',
            'Jüpiter': '♃',
            'Satürn': '♄',
            'Uranüs': '♅',
            'Neptün': '♆',
            'Plüton': '♇',
            'Kuzey Düğüm': '☊'
        };

        // Aspekt kuralları (derece toleransı ile)
        this.aspects = [
            { name: 'Conjunction', angle: 0, orb: 8, color: '#FFD700', symbol: '☌' },
            { name: 'Opposition', angle: 180, orb: 8, color: '#FF4444', symbol: '☍' },
            { name: 'Trine', angle: 120, orb: 8, color: '#44FF44', symbol: '△' },
            { name: 'Square', angle: 90, orb: 8, color: '#FF8844', symbol: '□' },
            { name: 'Sextile', angle: 60, orb: 6, color: '#4444FF', symbol: '⚹' }
        ];
    }

    // Ana çizim fonksiyonu
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Arka plan
        this.drawBackground();

        // Burç halkaları
        this.drawZodiacWheel();

        // Ev çizgileri
        this.drawHouses();

        // Aspektler (gezegenlerden önce çizilmeli)
        this.drawAspects();

        // Gezegenler
        this.drawPlanets();

        // Yükselen ve MC işaretleri
        this.drawAngles();

        // Derece işaretleri
        this.drawDegreeMarkers();
    }

    // Arka plan
    drawBackground() {
        // Dış çember (beyaz)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, 0, 2 * Math.PI);
        this.ctx.fill();

        // Sınır çizgisi
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Burç tekerleği
    drawZodiacWheel() {
        const startAngle = this.data.ascendant.degree;

        for (let i = 0; i < 12; i++) {
            const sign = this.zodiacSigns[i];
            const angle1 = this.degreeToRadian(startAngle - (i * 30));
            const angle2 = this.degreeToRadian(startAngle - ((i + 1) * 30));

            // Burç dilimi
            this.ctx.fillStyle = this.colors[sign.element] + '33'; // Şeffaf
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, this.zodiacRadius, angle1, angle2, true);
            this.ctx.lineTo(this.centerX, this.centerY);
            this.ctx.closePath();
            this.ctx.fill();

            // Burç sınır çizgileri
            this.ctx.strokeStyle = this.colors[sign.element];
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Burç sembolü
            const symbolAngle = angle1 - (Math.PI / 12); // Ortala
            const symbolX = this.centerX + Math.cos(symbolAngle) * (this.zodiacRadius - 25);
            const symbolY = this.centerY - Math.sin(symbolAngle) * (this.zodiacRadius - 25);

            this.ctx.fillStyle = this.colors[sign.element];
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(sign.symbol, symbolX, symbolY);
        }
    }

    // Evler
    drawHouses() {
        const ascendant = this.data.ascendant.degree;

        this.data.houses.forEach((houseDegree, index) => {
            // Ev çizgisi
            const angle = this.degreeToRadian(ascendant - houseDegree);

            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = index % 3 === 0 ? 3 : 1; // Ana açılar kalın
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(
                this.centerX + Math.cos(angle) * this.houseRadius,
                this.centerY - Math.sin(angle) * this.houseRadius
            );
            this.ctx.stroke();

            // Ev numarası
            const nextHouse = this.data.houses[(index + 1) % 12];
            const midAngle = this.degreeToRadian(ascendant - ((houseDegree + nextHouse) / 2));
            const numX = this.centerX + Math.cos(midAngle) * (this.houseRadius - 40);
            const numY = this.centerY - Math.sin(midAngle) * (this.houseRadius - 40);

            this.ctx.fillStyle = '#666';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText((index + 1).toString(), numX, numY);
        });
    }

    // Gezegenler
    drawPlanets() {
        const ascendant = this.data.ascendant.degree;
        const planets = [];

        // Gezegen verilerini topla
        for (const [name, position] of Object.entries(this.data.planets)) {
            if (!position.longitude) continue;

            planets.push({
                name: name,
                longitude: position.longitude,
                symbol: this.planetSymbols[name] || '?'
            });
        }

        // Çakışmaları önlemek için pozisyonları ayarla
        const adjustedPlanets = this.adjustPlanetPositions(planets, ascendant);

        // Gezegenleri çiz
        adjustedPlanets.forEach(planet => {
            const angle = this.degreeToRadian(ascendant - planet.displayLongitude);
            const x = this.centerX + Math.cos(angle) * this.planetRadius;
            const y = this.centerY - Math.sin(angle) * this.planetRadius;

            // Gezegen sembolü
            this.ctx.fillStyle = this.getPlanetColor(planet.name);
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(planet.symbol, x, y);

            // Gerçek pozisyona çizgi (eğer ayarlandıysa)
            if (planet.displayLongitude !== planet.longitude) {
                const realAngle = this.degreeToRadian(ascendant - planet.longitude);
                const realX = this.centerX + Math.cos(realAngle) * (this.planetRadius - 30);
                const realY = this.centerY - Math.sin(realAngle) * (this.planetRadius - 30);

                this.ctx.strokeStyle = '#999';
                this.ctx.lineWidth = 1;
                this.ctx.setLineDash([2, 2]);
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(realX, realY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        });
    }

    // Gezegen pozisyonlarını ayarla (çakışmaları önle)
    adjustPlanetPositions(planets, ascendant) {
        const minDistance = 10; // Minimum derece farkı
        const adjusted = planets.map(p => ({
            ...p,
            displayLongitude: p.longitude
        }));

        // Longitude'a göre sırala
        adjusted.sort((a, b) => a.longitude - b.longitude);

        // Çakışmaları kontrol et ve ayarla
        for (let i = 0; i < adjusted.length - 1; i++) {
            const diff = adjusted[i + 1].displayLongitude - adjusted[i].displayLongitude;
            if (diff < minDistance) {
                adjusted[i + 1].displayLongitude = adjusted[i].displayLongitude + minDistance;
            }
        }

        return adjusted;
    }

    // Gezegen rengi
    getPlanetColor(planetName) {
        const colors = {
            'Güneş': '#FFD700',
            'Ay': '#C0C0C0',
            'Merkür': '#FFA500',
            'Venüs': '#FF69B4',
            'Mars': '#FF0000',
            'Jüpiter': '#8B4513',
            'Satürn': '#4B0082',
            'Uranüs': '#00CED1',
            'Neptün': '#4169E1',
            'Plüton': '#8B0000',
            'Kuzey Düğüm': '#800080'
        };
        return colors[planetName] || '#333';
    }

    // Aspektler
    drawAspects() {
        const planets = [];

        for (const [name, position] of Object.entries(this.data.planets)) {
            if (!position.longitude) continue;
            planets.push({ name, longitude: position.longitude });
        }

        // Tüm gezegen çiftlerini kontrol et
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];

                let diff = Math.abs(planet1.longitude - planet2.longitude);
                if (diff > 180) diff = 360 - diff;

                // Aspekt var mı kontrol et
                for (const aspect of this.aspects) {
                    if (Math.abs(diff - aspect.angle) <= aspect.orb) {
                        this.drawAspectLine(planet1.longitude, planet2.longitude, aspect);
                        break;
                    }
                }
            }
        }
    }

    // Aspekt çizgisi
    drawAspectLine(long1, long2, aspect) {
        const ascendant = this.data.ascendant.degree;

        const angle1 = this.degreeToRadian(ascendant - long1);
        const angle2 = this.degreeToRadian(ascendant - long2);

        const x1 = this.centerX + Math.cos(angle1) * this.aspectRadius;
        const y1 = this.centerY - Math.sin(angle1) * this.aspectRadius;
        const x2 = this.centerX + Math.cos(angle2) * this.aspectRadius;
        const y2 = this.centerY - Math.sin(angle2) * this.aspectRadius;

        this.ctx.strokeStyle = aspect.color + '66'; // Şeffaf
        this.ctx.lineWidth = aspect.angle === 0 || aspect.angle === 180 ? 2 : 1;

        if (aspect.angle === 90 || aspect.angle === 180) {
            this.ctx.setLineDash([5, 5]); // Kesikli çizgi
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    // Açılar (Asc, MC)
    drawAngles() {
        const ascendant = this.data.ascendant.degree;

        // Ascendant (Yükselen) - Sol
        this.drawAngleMarker(0, 'ASC', '#FF6B6B');

        // MC (Orta Göğü) - Üst
        const mcRelative = this.data.mc.degree - ascendant;
        this.drawAngleMarker(mcRelative, 'MC', '#4ECDC4');

        // Descendant - Sağ
        this.drawAngleMarker(180, 'DSC', '#FF6B6B');

        // IC - Alt
        this.drawAngleMarker(mcRelative - 180, 'IC', '#4ECDC4');
    }

    // Açı işaretçisi
    drawAngleMarker(relativeDegree, label, color) {
        const angle = this.degreeToRadian(-relativeDegree);
        const x = this.centerX + Math.cos(angle) * (this.outerRadius + 20);
        const y = this.centerY - Math.sin(angle) * (this.outerRadius + 20);

        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, x, y);
    }

    // Derece işaretleri
    drawDegreeMarkers() {
        const ascendant = this.data.ascendant.degree;

        for (let deg = 0; deg < 360; deg += 30) {
            const angle = this.degreeToRadian(ascendant - deg);

            // Dış işaret
            const x1 = this.centerX + Math.cos(angle) * this.zodiacRadius;
            const y1 = this.centerY - Math.sin(angle) * this.zodiacRadius;
            const x2 = this.centerX + Math.cos(angle) * (this.zodiacRadius + 10);
            const y2 = this.centerY - Math.sin(angle) * (this.zodiacRadius + 10);

            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    // Derece to Radian (canvas için ters çevir)
    degreeToRadian(degree) {
        return (degree * Math.PI) / 180;
    }
}

// Chart'ı çiz
function drawNatalChart(data) {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '<canvas id="natalChartCanvas"></canvas>';

    const chart = new NatalChart('natalChartCanvas', data);
    chart.draw();

    // Chart'ı göster
    chartContainer.style.display = 'block';
}
