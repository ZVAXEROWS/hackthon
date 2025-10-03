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
        'header':true,
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

        const cache = await caches.open("nasa-cache");
        await cache.put(urlWithParams, response.clone());
        
    } catch(e){
        
    }
}

async function loadCache(){
    // for later usage
    const cachedResponse = await cache.match(urlWithParams);
    if (cachedResponse) {
        const csv = await cachedResponse.text();
        console.log("Loaded cached CSV:", csv);
    }

}
async function deleteAllCache() {
    const success = await caches.delete("nasa-cache");
    console.log(success ? "Cache deleted" : "Cache not found");
}

