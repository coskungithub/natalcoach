// Professional Natal Chart Class - Black & White Line Art
class NatalChart {
    constructor(canvasId, data) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = data;

        // Canvas dimensions - high resolution for crisp lines
        this.width = 1000;
        this.height = 1000;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Center point
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        // Radius definitions for different zones
        this.radii = {
            outer: 480,              // Outer boundary
            zodiacOuter: 460,        // Outer edge of zodiac ring
            zodiacInner: 380,        // Inner edge of zodiac ring
            degreeScale: 370,        // Degree scale position
            planetZoneOuter: 360,    // Outer edge of planet placement zone
            planetZoneInner: 320,    // Inner edge of planet placement zone
            houseCusp: 300,          // Where house lines end
            aspectZone: 280          // Aspect line connection radius
        };

        // Zodiac signs in order (starting from Aries)
        this.zodiacSigns = [
            { name: 'Aries', symbol: '♈' },
            { name: 'Taurus', symbol: '♉' },
            { name: 'Gemini', symbol: '♊' },
            { name: 'Cancer', symbol: '♋' },
            { name: 'Leo', symbol: '♌' },
            { name: 'Virgo', symbol: '♍' },
            { name: 'Libra', symbol: '♎' },
            { name: 'Scorpio', symbol: '♏' },
            { name: 'Sagittarius', symbol: '♐' },
            { name: 'Capricorn', symbol: '♑' },
            { name: 'Aquarius', symbol: '♒' },
            { name: 'Pisces', symbol: '♓' }
        ];

        // Planet symbols
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

        // Aspect definitions
        this.aspects = [
            { name: 'Conjunction', angle: 0, orb: 8, lineWidth: 2, lineDash: [] },
            { name: 'Opposition', angle: 180, orb: 8, lineWidth: 2, lineDash: [] },
            { name: 'Trine', angle: 120, orb: 8, lineWidth: 1.5, lineDash: [] },
            { name: 'Square', angle: 90, orb: 8, lineWidth: 1.5, lineDash: [5, 5] },
            { name: 'Sextile', angle: 60, orb: 6, lineWidth: 1, lineDash: [3, 3] }
        ];
    }

    // Main drawing function
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Set white background
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw in order (back to front)
        this.drawOuterZodiacRing();
        this.drawDegreeScale();
        this.drawInnerHouseGrid();
        this.drawAspects();
        this.drawPlanets();
    }

    // 1. OUTER ZODIAC RING - Static reference frame
    drawOuterZodiacRing() {
        // Draw outer and inner circles for zodiac ring
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;

        // Outer boundary
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radii.zodiacOuter, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Inner boundary (thick separator)
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radii.zodiacInner, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Draw 12 equal sectors for zodiac signs
        // Aries starts at 9 o'clock (270° in standard orientation, counter-clockwise)
        const sectorAngle = 30; // 360° / 12 = 30° per sign

        for (let i = 0; i < 12; i++) {
            const sign = this.zodiacSigns[i];

            // Calculate angles (starting from Aries at 9 o'clock, going counter-clockwise)
            // In canvas: 0° is at 3 o'clock, we want Aries at 9 o'clock (180°)
            const startAngle = this.degreeToRadian(180 - (i * sectorAngle));
            const endAngle = this.degreeToRadian(180 - ((i + 1) * sectorAngle));

            // Draw sector dividing lines
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.centerX + Math.cos(startAngle) * this.radii.zodiacInner,
                this.centerY + Math.sin(startAngle) * this.radii.zodiacInner
            );
            this.ctx.lineTo(
                this.centerX + Math.cos(startAngle) * this.radii.zodiacOuter,
                this.centerY + Math.sin(startAngle) * this.radii.zodiacOuter
            );
            this.ctx.stroke();

            // Draw zodiac symbol in the center of each sector
            const midAngle = startAngle - this.degreeToRadian(sectorAngle / 2);
            const symbolRadius = (this.radii.zodiacOuter + this.radii.zodiacInner) / 2;
            const symbolX = this.centerX + Math.cos(midAngle) * symbolRadius;
            const symbolY = this.centerY + Math.sin(midAngle) * symbolRadius;

            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(sign.symbol, symbolX, symbolY);
        }
    }

    // 2. DEGREE SCALE - Precise ruler around the zodiac ring
    drawDegreeScale() {
        // Draw degree markers from 0° to 360°
        // Major ticks every 10°, minor ticks every 1°

        for (let deg = 0; deg < 360; deg++) {
            // Convert to canvas angle (accounting for Aries at 9 o'clock)
            const angle = this.degreeToRadian(180 - deg);

            let tickLength;
            let lineWidth;

            if (deg % 10 === 0) {
                // Major tick every 10 degrees
                tickLength = 12;
                lineWidth = 2;
            } else if (deg % 5 === 0) {
                // Medium tick every 5 degrees
                tickLength = 8;
                lineWidth = 1.5;
            } else {
                // Minor tick every degree
                tickLength = 4;
                lineWidth = 1;
            }

            // Inner point
            const innerX = this.centerX + Math.cos(angle) * this.radii.zodiacInner;
            const innerY = this.centerY + Math.sin(angle) * this.radii.zodiacInner;

            // Outer point
            const outerX = this.centerX + Math.cos(angle) * (this.radii.zodiacInner - tickLength);
            const outerY = this.centerY + Math.sin(angle) * (this.radii.zodiacInner - tickLength);

            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(innerX, innerY);
            this.ctx.lineTo(outerX, outerY);
            this.ctx.stroke();

            // Add degree numbers every 30 degrees
            if (deg % 30 === 0) {
                const labelRadius = this.radii.zodiacInner - 25;
                const labelX = this.centerX + Math.cos(angle) * labelRadius;
                const labelY = this.centerY + Math.sin(angle) * labelRadius;

                this.ctx.fillStyle = '#000000';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(deg + '°', labelX, labelY);
            }
        }
    }

    // 3. INNER HOUSE GRID - Dynamic house structure
    drawInnerHouseGrid() {
        const ascendant = this.data.ascendant.degree;

        // Draw house cusp lines
        this.data.houses.forEach((houseDegree, index) => {
            // Calculate angle relative to Aries at 9 o'clock position
            const houseAngleFromAries = houseDegree;
            const canvasAngle = this.degreeToRadian(180 - houseAngleFromAries);

            // Determine if this is a main angle (ASC, DSC, MC, IC)
            // Houses: 1=ASC, 4=IC, 7=DSC, 10=MC
            const isMainAngle = (index === 0 || index === 3 || index === 6 || index === 9);

            // Set line style
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = isMainAngle ? 3 : 1;

            // Draw house cusp line from center to house cusp radius
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.centerX + Math.cos(canvasAngle) * this.radii.aspectZone,
                this.centerY + Math.sin(canvasAngle) * this.radii.aspectZone
            );
            this.ctx.lineTo(
                this.centerX + Math.cos(canvasAngle) * this.radii.houseCusp,
                this.centerY + Math.sin(canvasAngle) * this.radii.houseCusp
            );
            this.ctx.stroke();

            // Draw angle marker labels for main angles
            if (isMainAngle) {
                let label = '';
                if (index === 0) label = 'ASC';
                else if (index === 3) label = 'IC';
                else if (index === 6) label = 'DSC';
                else if (index === 9) label = 'MC';

                const labelRadius = this.radii.houseCusp + 25;
                const labelX = this.centerX + Math.cos(canvasAngle) * labelRadius;
                const labelY = this.centerY + Math.sin(canvasAngle) * labelRadius;

                // Draw label with box background
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(labelX - 20, labelY - 10, 40, 20);

                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(labelX - 20, labelY - 10, 40, 20);

                this.ctx.fillStyle = '#000000';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(label, labelX, labelY);
            }

            // Draw house numbers
            const nextHouseDegree = this.data.houses[(index + 1) % 12];
            let midDegree = (houseDegree + nextHouseDegree) / 2;

            // Handle wraparound
            if (nextHouseDegree < houseDegree) {
                midDegree = ((houseDegree + nextHouseDegree + 360) / 2) % 360;
            }

            const midAngle = this.degreeToRadian(180 - midDegree);
            const numRadius = (this.radii.houseCusp + this.radii.aspectZone) / 2;
            const numX = this.centerX + Math.cos(midAngle) * numRadius;
            const numY = this.centerY + Math.sin(midAngle) * numRadius;

            this.ctx.fillStyle = '#000000';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText((index + 1).toString(), numX, numY);
        });

        // Draw planet placement zone boundaries
        this.ctx.strokeStyle = '#999999';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radii.planetZoneOuter, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radii.planetZoneInner, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
    }

    // 4. PLANETS - Place planets in their zones
    drawPlanets() {
        const planets = [];

        // Collect planet data
        for (const [name, position] of Object.entries(this.data.planets)) {
            if (!position.longitude) continue;

            planets.push({
                name: name,
                longitude: position.longitude,
                symbol: this.planetSymbols[name] || '?'
            });
        }

        // Adjust positions to prevent overlap
        const adjustedPlanets = this.adjustPlanetPositions(planets);

        // Draw each planet
        adjustedPlanets.forEach(planet => {
            // Convert planet longitude to canvas angle
            const canvasAngle = this.degreeToRadian(180 - planet.displayLongitude);

            // Position in planet zone
            const planetRadius = (this.radii.planetZoneOuter + this.radii.planetZoneInner) / 2;
            const x = this.centerX + Math.cos(canvasAngle) * planetRadius;
            const y = this.centerY + Math.sin(canvasAngle) * planetRadius;

            // Draw planet symbol
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(planet.symbol, x, y);

            // Draw line to actual position if adjusted
            if (planet.displayLongitude !== planet.longitude) {
                const realAngle = this.degreeToRadian(180 - planet.longitude);
                const realX = this.centerX + Math.cos(realAngle) * this.radii.planetZoneInner;
                const realY = this.centerY + Math.sin(realAngle) * this.radii.planetZoneInner;

                this.ctx.strokeStyle = '#666666';
                this.ctx.lineWidth = 0.5;
                this.ctx.setLineDash([2, 2]);
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(realX, realY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        });
    }

    // Adjust planet positions to prevent overlap
    adjustPlanetPositions(planets) {
        const minDistance = 8; // Minimum degrees between planets
        const adjusted = planets.map(p => ({
            ...p,
            displayLongitude: p.longitude
        }));

        // Sort by longitude
        adjusted.sort((a, b) => a.longitude - b.longitude);

        // Adjust overlapping positions
        for (let i = 0; i < adjusted.length - 1; i++) {
            let diff = adjusted[i + 1].displayLongitude - adjusted[i].displayLongitude;

            // Handle wraparound
            if (diff < 0) diff += 360;

            if (diff < minDistance) {
                adjusted[i + 1].displayLongitude = (adjusted[i].displayLongitude + minDistance) % 360;
            }
        }

        return adjusted;
    }

    // 5. ASPECTS - Draw aspect lines in the center
    drawAspects() {
        const planets = [];

        // Collect planet data
        for (const [name, position] of Object.entries(this.data.planets)) {
            if (!position.longitude) continue;
            planets.push({ name, longitude: position.longitude });
        }

        // Check all planet pairs for aspects
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];

                // Calculate angular difference
                let diff = Math.abs(planet1.longitude - planet2.longitude);
                if (diff > 180) diff = 360 - diff;

                // Check if this matches any aspect
                for (const aspect of this.aspects) {
                    if (Math.abs(diff - aspect.angle) <= aspect.orb) {
                        this.drawAspectLine(planet1.longitude, planet2.longitude, aspect);
                        break;
                    }
                }
            }
        }
    }

    // Draw a single aspect line
    drawAspectLine(long1, long2, aspect) {
        // Convert longitudes to canvas angles
        const angle1 = this.degreeToRadian(180 - long1);
        const angle2 = this.degreeToRadian(180 - long2);

        // Calculate points on the aspect zone circle
        const x1 = this.centerX + Math.cos(angle1) * this.radii.aspectZone;
        const y1 = this.centerY + Math.sin(angle1) * this.radii.aspectZone;
        const x2 = this.centerX + Math.cos(angle2) * this.radii.aspectZone;
        const y2 = this.centerY + Math.sin(angle2) * this.radii.aspectZone;

        // Draw aspect line
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = aspect.lineWidth;
        this.ctx.globalAlpha = 0.3; // Make aspects semi-transparent
        this.ctx.setLineDash(aspect.lineDash);

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1.0;
    }

    // Convert degrees to radians for canvas
    degreeToRadian(degree) {
        return (degree * Math.PI) / 180;
    }
}

// Initialize and draw the chart
function drawNatalChart(data) {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '<canvas id="natalChartCanvas"></canvas>';

    const chart = new NatalChart('natalChartCanvas', data);
    chart.draw();

    // Display the chart
    chartContainer.style.display = 'block';
}
