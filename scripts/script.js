const button = document.getElementById('clicker');

button.addEventListener('click', () => saveData(30.0303, 30.29234));


const weatherActivities = {
    hot: {
        avoid: [
            "Going out at midday without protection",
            "Heavy outdoor exercise under the sun",
            "Wearing dark or synthetic fabrics",
            "Leaving pets or kids in cars",
            "Consuming too much caffeine",
            "Eating heavy oily foods",
            "Ignoring sunscreen",
            "Walking barefoot on hot pavement",
            "Neglecting hydration",
            "Staying in unventilated rooms"
        ],
        do: [
            "Drink plenty of water frequently",
            "Wear light, breathable fabrics",
            "Use sunscreen and sunglasses",
            "Stay in shaded areas",
            "Take cool showers",
            "Eat hydrating foods like fruits",
            "Keep windows open for airflow",
            "Use fans or air conditioning",
            "Plan activities for early morning/evening",
            "Rest often and avoid overexertion"
        ]
    },
    cold: {
        avoid: [
            "Going outside without warm clothes",
            "Leaving skin exposed to cold wind",
            "Drinking very cold water outdoors",
            "Neglecting gloves and scarves",
            "Overusing heaters without ventilation",
            "Staying wet in damp clothes",
            "Sleeping in unheated rooms",
            "Driving without checking icy roads",
            "Skipping breakfast before going out",
            "Breathing through the mouth in cold air"
        ],
        do: [
            "Wear layered warm clothing",
            "Use hats, scarves, and gloves",
            "Drink warm beverages",
            "Keep indoor heating at a safe level",
            "Take warm showers",
            "Moisturize skin to prevent dryness",
            "Eat hot soups and nutritious meals",
            "Exercise indoors to stay active",
            "Check weather alerts before traveling",
            "Keep extra blankets handy"
        ]
    },
    dusty: {
        avoid: [
            "Going outside during peak dust hours",
            "Opening windows and doors",
            "Drying clothes outside",
            "Outdoor workouts",
            "Driving fast with windows down",
            "Touching eyes without washing hands",
            "Ignoring allergy symptoms",
            "Using fans that pull dust inside",
            "Sleeping without air filters",
            "Leaving electronics uncovered"
        ],
        do: [
            "Wear a mask or scarf over the nose",
            "Stay indoors with windows closed",
            "Use air purifiers if possible",
            "Cover food and water containers",
            "Keep floors and surfaces clean",
            "Wash face and hands frequently",
            "Wear glasses to protect eyes",
            "Check weather before traveling",
            "Stay hydrated to ease breathing",
            "Take allergy medications if prescribed"
        ]
    },
    rainy: {
        avoid: [
            "Going out without umbrella or raincoat",
            "Driving fast on wet roads",
            "Walking in floodwaters",
            "Wearing leather shoes",
            "Using electrical items with wet hands",
            "Parking vehicles in low areas",
            "Ignoring weather warnings",
            "Standing under trees in lightning",
            "Letting clothes stay damp",
            "Traveling on bikes without protection"
        ],
        do: [
            "Carry an umbrella or raincoat",
            "Wear waterproof shoes or boots",
            "Dry clothes immediately after use",
            "Drive slowly and carefully",
            "Eat warm food to stay comfortable",
            "Stay indoors during heavy rain",
            "Check drainage around your home",
            "Keep torch and backup power ready",
            "Enjoy hot tea or soup",
            "Store valuables in waterproof bags"
        ]
    },
    snowy: {
        avoid: [
            "Driving without snow tires or chains",
            "Walking without proper boots",
            "Overexerting while shoveling snow",
            "Leaving pipes uninsulated",
            "Parking cars in open snow zones",
            "Ignoring icy road warnings",
            "Using wet socks or shoes",
            "Neglecting car antifreeze",
            "Skipping gloves and hats",
            "Going outside during blizzards"
        ],
        do: [
            "Wear insulated boots and gloves",
            "Keep pathways salted or sanded",
            "Carry emergency supplies in the car",
            "Dress in multiple layers",
            "Cover face with scarf to warm air",
            "Use heating safely indoors",
            "Keep pets warm and indoors",
            "Stock extra food and firewood",
            "Enjoy snow sports carefully",
            "Check for school/work weather updates"
        ]
    },
    warm: {
        avoid: [
            "Wearing too many layers",
            "Ignoring hydration needs",
            "Overeating heavy fatty foods",
            "Staying indoors without ventilation",
            "Exercising in closed hot rooms",
            "Leaving food unrefrigerated",
            "Exposing electronics to direct sun",
            "Skipping sunscreen if sunny",
            "Neglecting light evening walks",
            "Sleeping without airflow"
        ],
        do: [
            "Wear comfortable light clothes",
            "Enjoy outdoor activities like jogging",
            "Keep windows open for ventilation",
            "Eat light meals rich in fruits",
            "Take walks in the evening breeze",
            "Stay hydrated with water or juice",
            "Use sunscreen if needed",
            "Maintain a balanced sleep schedule",
            "Plan picnics or outings",
            "Do light stretching or yoga"
        ]
    }
};


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

function getActivities(status) {
    const data = weatherActivities[status];
    if (!data) {
        console.log("Unknown weather status");
        return;
    }
    console.log(`Things to avoid in ${status}:`, data.avoid);
    console.log(`Things to do in ${status}:`, data.do);
}