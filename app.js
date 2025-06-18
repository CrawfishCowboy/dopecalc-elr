
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

        // Simplified Coriolis approximation (not exact physics)
        const timeOfFlight = i / velocity; // seconds
        const earthRotationRate = 7.292115e-5; // rad/s
        const coriolis = 2 * velocity * earthRotationRate * Math.sin(latitude * Math.PI / 180) * timeOfFlight * Math.cos(azimuth * Math.PI / 180);
        const coriolisMil = coriolis * 1000 / i; // convert radians to MILs approx

        const spinDrift = 0.0005 * i; // basic right-hand twist spin drift estimate
output += `${i}\t${drop.toFixed(2)}\t${windDrift.toFixed(2)}\t${coriolisMil.toFixed(3)}\t${spinDrift.toFixed(2)}\n`;
    }

    document.getElementById('output').textContent = output;
});

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
        // For non-iOS devices
        window.addEventListener('deviceorientation', (event) => {
            const azimuth = event.alpha ? event.alpha.toFixed(1) : 0;
            const elevation = event.beta ? event.beta.toFixed(1) : 0;
            document.getElementById('liveAzimuth').value = azimuth;
            document.getElementById('liveElevation').value = elevation;
            document.getElementById('azimuth').value = azimuth;
        });
    }
});

// Save profile
document.getElementById('saveProfile').addEventListener('click', () => {
    const profileName = prompt("Enter a name for this profile:");
    if (!profileName) return;

    const profile = {
        bulletWeight: document.getElementById('bulletWeight').value,
        bc: document.getElementById('bc').value,
        velocity: document.getElementById('velocity').value,
        scopeHeight: document.getElementById('scopeHeight').value,
        zero: document.getElementById('zero').value,
        maxDist: document.getElementById('maxDist').value,
        increment: document.getElementById('increment').value,
        da: document.getElementById('da').value,
        wind: document.getElementById('wind').value,
        latitude: document.getElementById('latitude').value,
        azimuth: document.getElementById('azimuth').value
    };

    localStorage.setItem("profile_" + profileName, JSON.stringify(profile));
    updateProfileDropdown();
});

// Load profile
document.getElementById('loadProfile').addEventListener('click', () => {
    const selected = document.getElementById('profileSelect').value;
    if (!selected) return;

    const profile = JSON.parse(localStorage.getItem("profile_" + selected));
    if (!profile) return;

    for (let key in profile) {
        if (document.getElementById(key)) {
            document.getElementById(key).value = profile[key];
        }
    }
});

// Populate dropdown
function updateProfileDropdown() {
    const dropdown = document.getElementById('profileSelect');
    dropdown.innerHTML = '<option value="">-- Select Profile --</option>';
    for (let key in localStorage) {
        if (key.startsWith("profile_")) {
            const name = key.replace("profile_", "");
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        }
    }
}

// On load
updateProfileDropdown();
