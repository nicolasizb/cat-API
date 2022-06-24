// APPLYING AXIOS
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
})
api.defaults.headers.common['X-API-KEY'] = 'a19c2562-962c-4bec-b3cf-493297108d82';

const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=2";
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites"
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload"

const error = document.getElementById("error");

async function loadRandomCats() {
    const response = await fetch(API_URL_RANDOM);
    const data = await response.json();
    console.log("Random");
    console.log(data);

    if(response.status !== 200) {
        error.innerHTML = "There is an Error " + response.status;
    } else {
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
        const btnSave1 = document.getElementById("buttonSaveCat1");
        const btnSave2 = document.getElementById("buttonSaveCat2");

        img1.src = data[0].url;
        img2.src = data[1].url;

        btnSave1.onclick = () => saveFavoriteCat(data[0].id);
        btnSave2.onclick = () => saveFavoriteCat(data[1].id);
    }
}

async function loadFavoriteCat() {
    const response = await fetch(API_URL_FAVORITES,{
        method: "GET",
        headers: {
            'X-API-KEY': 'a19c2562-962c-4bec-b3cf-493297108d82'
        },
    });
    const data = await response.json();
    console.log("Favorites");
    console.log(data);

    if(response.status !== 200){
        error.innerHTML = "There is an Error " + response.status + data.message;
    } else {
        const section =  document.getElementById("favoritesCats");
        section.innerHTML = "";

        const h2 = document.createElement("h2");
        const h2Text = document.createTextNode("FAVORITES CATS");
        section.appendChild(h2);
        h2.appendChild(h2Text);

        data.forEach(cat => {
            const art = document.createElement("article"); 
            const img = document.createElement("img");
            const btnDelete = document.createElement("button");
            const btnText = document.createTextNode("Remove cats from favorites");
            
            section.appendChild(art);
            art.appendChild(img);
            art.appendChild(btnDelete)
            btnDelete.appendChild(btnText);
            btnDelete.onclick = () => deleteFavoriteCat(cat.id);
            img.src = cat.image.url;
        });
    }
}

async function saveFavoriteCat(id) {
    const { data, status } = await api.post('/favourites', {
        image_id: id,
    });

    // const response = await fetch(API_URL_FAVORITES, {
    //     method: "POST",
    //     headers: {
    //         'Content-Type':'application/json',
    //         'X-API-KEY': 'a19c2562-962c-4bec-b3cf-493297108d82'
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     })
    // });
    // const data = await response.json();

    console.log("Saved");

    if(status !== 200){
        console.error("There is an Error " + status + data.message);
    } else {
        console.log("Cat saved")
        loadFavoriteCat();
    }
}

async function deleteFavoriteCat(id){
    const response = await fetch(API_URL_FAVORITES_DELETE(id),{
        method: "DELETE",
        headers: {
            'X-API-KEY':'a19c2562-962c-4bec-b3cf-493297108d82'
        }
    });
    const data = await response.json()
    
    if(response.status !== 200){
        error.innerHTML = "There is an Error " + response.status + data.message;
    } else {
        console.log("cat removed");
        loadFavoriteCat()
    }
}

async function uploadCatPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const response =  await fetch(API_URL_UPLOAD, {
        method: "POST",
        headers: {
            'X-API-KEY': 'a19c2562-962c-4bec-b3cf-493297108d82'
        },
        body: formData,
    });

    const data = await response.json();
    saveFavoriteCat(data.id);
    
    if(response.status !== 200) {
        error.innerHTML = "There is an Error " + response.status + data.message;
    } else {
        console.log('Cat ADDED')
        loadFavoriteCat();
    }
}

loadRandomCats()
loadFavoriteCat()
