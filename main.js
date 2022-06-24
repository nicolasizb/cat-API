const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;


// async function validation(catD) {
//     const response = await fetch(API_URL_FAVORITES, {
//         method: 'GET',
//         headers: {
//             'X-API-KEY':'a19c2562-962c-4bec-b3cf-493297108d82'
//         }
//     });
//     const data = await response.json();

//     data.filter(catID => {
//         if(catID.image.id !== catD.id) {
//             console.log("Saved Cat!")
//             saveFavoriteCat(catD.id);
//         } else {
//             console.log('No pasa el filtro')
//         }
//     });
// }

async function loadRandomCats() {
    const response = await fetch(API_URL_RANDOM);
    const data = await response.json();
    console.log("Random")
    console.log(data)

    if(response.status === 200) {
        const imgRandom1 = document.getElementById('imageRandom1');
        const imgRandom2 = document.getElementById('imageRandom2');
        const btnSave1 = document.getElementById('saveFavoriteCat1');
        const btnSave2 = document.getElementById('saveFavoriteCat2');

        imgRandom1.src = data[0].url;
        imgRandom2.src = data[1].url;

        const dataURL1 = [...data].map(cat => cat)[0];
        const dataURL2 = [...data].map(cat => cat)[1];
        console.log("datacopy",dataURL1)
        console.log("datacopy2",dataURL2)

        btnSave1.onclick = () => saveFavoriteCat(data[0].id);
        btnSave2.onclick = () => saveFavoriteCat(data[1].id);

    } else {
        console.error("There is an Error " + response.status + data.messaje);
    }
};

async function loadFavoriteCats() {
    const response = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY':'a19c2562-962c-4bec-b3cf-493297108d82'
        }
    });
    const data = await response.json();
    console.log("Favorites");
    console.log(data)

    if(response.status !== 200) {
        console.error("There is an Error " + response.status + data.messaje);
    } else {
        const art = document.getElementById('favorite-cats');
        art.innerHTML = "";

        const divImages = document.createElement('div')
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('FAVORITE CATS');

        data.forEach(cat => {
            const btnDelete = document.createElement('button');
            const btnDeleteText = document.createTextNode('Remove Cat');
            const section = document.createElement('section');
            const imgFavorite = document.createElement('img');

            art.appendChild(h2)
            h2.appendChild(h2Text)             
            art.appendChild(divImages)
            divImages.appendChild(section);
            section.appendChild(imgFavorite);
            section.appendChild(btnDelete);
            btnDelete.appendChild(btnDeleteText);

            imgFavorite.src = cat.image.url;
            btnDelete.onclick = () => deleteCatFavorite(cat.id);
        });
    }
};

async function saveFavoriteCat(id) {
    const response = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY':'a19c2562-962c-4bec-b3cf-493297108d82'
        },
        body: JSON.stringify({
            'image_id': id
        })
    });
    const data = await response.json();

    if(response.status !== 200) {
        console.error("There is an Error " + response.status + data.messaje);
    } else {
        console.log('Save Cat!')
        loadFavoriteCats()
    }
};

async function deleteCatFavorite(id) {
    const response = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY':'a19c2562-962c-4bec-b3cf-493297108d82'
        },
    });
    const data = await response.json();
    if(response.status !== 200) {
        console.error("There is an Error " + response.status + data.messaje);
    } else {
        console.log("DELETE CAT")
        loadFavoriteCats()
    }
}

loadRandomCats()
loadFavoriteCats()

const loadImagePreview = () => {
    const file = document.getElementById("file").files;
    console.log(file)
    if(file.length > 0) {
        const fileReader = new FileReader();

        fileReader.onload = function(event) {
            document.getElementById("preview").setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
    }
}



  