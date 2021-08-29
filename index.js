async function weather(coords) {
    const key = '1b5ee5a1a74d624a74750350327ea372'; //ключ openweather
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords['lat']}&lon=${coords['lng']}&appid=${key}`);
    const rezult = await response.json();
    const weather = rezult['weather'][0];

    var temp = rezult['main']['temp']-273.15
    temp = temp.toFixed(1); //температура

    var information = {
        'name': rezult.name,
        'weather': rezult['weather'][0]['description'],
        'icon': `http://openweathermap.org/img/w/${rezult['weather'][0]['icon']}.png`,
        'temp': temp
    };
    console.log(information.name);
    console.log(information.weather);
    return information;
}

async function setMarker(coords, myMap) {
    var inform = await weather(coords);

    var marker = new google.maps.Marker({
        position: coords,
        map: myMap,
        title: `${inform['weather']}`,
        icon: inform['icon']
    });

    var info_click = new google.maps.InfoWindow({
        content: `<h3>${inform['name']}</h3><p>${inform['weather']}</p><p>Temp: ${inform['temp']}</p>`,
    });

    marker.addListener("click", function() {
        info_click.open(myMap, marker);
    });
}

function initMap() {
    var coords_cities = {
        'vinnytsia' : {lat:  49.232823170243904, lng: 28.463282037424015}
    };
    var opt = {
        center: coords_cities['vinnytsia'],
        zoom: 10
    }
    var myMap = new google.maps.Map(document.getElementById('map'), opt);

    for (var city in coords_cities) {
        setMarker(coords_cities[city], myMap);
    }

    google.maps.event.addListener(myMap, 'click', function(event) {
        var latLng = event.latLng;
        var obj = {
            lat : latLng.lat(),
            lng : latLng.lng()
        };
        setMarker(obj, myMap);
        console.log(obj);
    });
}

