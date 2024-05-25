if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: position.timestamp
                };

                fetch('/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(location)
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Location data sent successfully');
                    } else {
                        console.error('Error sending location data');
                    }
                });
            }, error => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
