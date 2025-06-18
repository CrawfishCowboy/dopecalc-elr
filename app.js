
document.getElementById('dope-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const bulletWeight = parseFloat(document.getElementById('bulletWeight').value);
    const bc = parseFloat(document.getElementById('bc').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const scopeHeight = parseFloat(document.getElementById('scopeHeight').value);
    const zero = parseFloat(document.getElementById('zero').value);
    const maxDist = parseFloat(document.getElementById('maxDist').value);
    const increment = parseFloat(document.getElementById('increment').value);
    const da = parseFloat(document.getElementById('da').value);
    const wind = parseFloat(document.getElementById('wind').value);
    const latitude = parseFloat(document.getElementById('latitude').value);
    const azimuth = parseFloat(document.getElementById('azimuth').value);

    let output = 'Yards\tDrop (MIL)\tWind Drift (MIL)\tCoriolis Drift (MIL)\tSpin Drift (MIL)\n';
    for (let i = increment; i <= maxDist; i += increment) {
        const drop = (0.0072 * i); // placeholder drop
        const windDrift = (0.0016 * i); // placeholder wind drift

        // Simplified Coriolis calculation
        const timeOfFlight = i / velocity;
        const earthRotationRate = 7.292115e-5;
        const coriolis = 2 * velocity * earthRotationRate * Math.sin(latitude * Math.PI / 180) * timeOfFlight * Math.cos(azimuth * Math.PI / 180);
        const coriolisMil = coriolis * 1000 / i;

        const spinDrift = 0.0005 * i;

        output += `${i}\t${drop.toFixed(2)}\t${windDrift.toFixed(2)}\t${coriolisMil.toFixed(3)}\t${spinDrift.toFixed(2)}\n`;
    }

    document.getElementById('output').textContent = output;
});

// Live orientation
document.getElementById('get-orientation').addEventListener('click', () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', (event) => {
                        const azimuth = event.alpha ? event.alpha.toFixed(1) : 0;
                        const elevation = event.beta ? event.beta.toFixed(1) : 0;
                        document.getElementById('liveAzimuth').value = azimuth;
                        document.getElementById('liveElevation').value = elevation;
                        document.getElementById('azimuth').value = azimuth;
                    });
                }
            }).catch(console.error);
    } else {
        window.addEventListener('deviceorientation', (event) => {
            const azimuth = event.alpha ? event.alpha.toFixed(1) : 0;
            const elevation = event.beta ? event.beta.toFixed(1) : 0;
            document.getElementById('liveAzimuth').value = azimuth;
            document.getElementById('liveElevation').value = elevation;
            document.getElementById('azimuth').value = azimuth;
        });
    }
});
