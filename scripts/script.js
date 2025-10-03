const button = document.getElementById('clicker');

button.addEventListener('click', () => saveData(30.0303, 30.29234));


async function saveData (long, lat){
    const baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';
    const params = {
        'start': 19830101,
        'end': 20250101,
        'latitude':lat,
        'longitude':long,
        'community':'ag',
        'parameters':'ALLSKY_SFC_SW_DWN,PS,RH2M,T2M_MAX,T2M_MIN,WS2M,WS50M',
        'format':'csv',
        'units':'metric',
        'header':false,
        'time-standard':'utc'
    }

    try {
        const queryString = new URLSearchParams(params).toString();
        const urlWithParams = `${baseUrl}?${queryString}`;
        console.log('Entered try zone');
        const response = await fetch(urlWithParams, {
            method: 'GET',
            headers: {
                'Accept': 'text/csv'
            }
        });

        if(!response.ok){
            throw new Error(`HTTP error!: ${response.status}`)
        }
        console.log('resopnse is ok');
        saveCache(urlWithParams, response);
        logCache();
        
    } catch(e){
        
    }
}

async function saveCache(url, response){
    const cache = await caches.open("nasa-cache");
    await cache.put(url, response.clone());
}

async function logCache() {
    const cache = await caches.open("nasa-cache");
    const requests = await cache.keys();

    for (const request of requests) {
        console.log("Cached request URL:", request.url);

        const response = await cache.match(request);
        if (response) {
            const text = await response.text();
            console.log("Cached response content:", text.substring(0, 2000) + "...");
        }
    }
}

async function loadCache(url){
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
        const csv = await cachedResponse.text();
        console.log("Loaded cached CSV:", csv);
    }

}
async function deleteAllCache() {
    const success = await caches.delete("nasa-cache");
    console.log(success ? "Cache deleted" : "Cache not found");
}

