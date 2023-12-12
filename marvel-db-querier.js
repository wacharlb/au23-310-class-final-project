
// Marvel API Base URL
const baseUrl = 'https://gateway.marvel.com';


// Form Element
const form = document.getElementById('search-form');
const searchfield = document.getElementById("search-field"); 
const comicsTableContainer = document.getElementById('comics-table-container');
const seriesTableContainer = document.getElementById('series-table-container');
const eventsTableContainer = document.getElementById('events-table-container');

let total = 0;
let pageCount = 1;
let currentPage = 1;

const limit = 20;
let offset = 0;

const EndpointType = {
    Character: Symbol('character'),
    Comics: Symbol('comics')
}

function clearTable(tableName) {
    const table = document.getElementById(tableName);
    if(table !== null) {
        table.innerHTML = ''; // Clear the table content
    }
}

const submitButton = document.getElementById('submit-btn');
form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    //allComics = [];
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';

    const searchWords = searchfield.value;    

    const starting_offset = 0;    
    displayComicsForCharacterName(searchWords, 20, 0);
});

const nextButton = document.getElementById('next-btn');
nextButton.addEventListener('click', function(e) {
    e.preventDefault();

    currentPage = total / limit

    if(offset + limit <= total) {
        offset += limit;
    }
    
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';


    const searchWords = searchfield.value;
    displayComicsForCharacterName(searchWords, limit, offset);
});

const prevButton = document.getElementById('prev-btn');
prevButton.addEventListener('click', function(e) {
    e.preventDefault();
    if(offset > 0) {
        offset -= limit;
    }

    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';

    const searchWords = searchfield.value;    
    displayComicsForCharacterName(searchWords, limit, offset);
});

const clearButton = document.getElementById('clear-btn');
clearButton.addEventListener("click", function(e) {
    e.preventDefault();    
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';

    nextButton.classList.add('hidden');
    prevButton.classList.add('hidden');
});

function displayComicCover(imageUrl) {
    // Create an img element
    const imgElement = document.createElement('img');

    // Set the src attribute of the img element to the fetched image URL
    imgElement.src = imageUrl;

    // Get the container div where you want to display the image
    const container = document.getElementById('comicCoverContainer');

    // Append the img element to the container
    container.appendChild(imgElement);
}

comicsTableContainer.addEventListener('click', function(event) {
    const target = event.target;
    if(target.tagName === "IMG") {
        const link = target.largeImage.src;

        window.open(link);
    }
});

displayComicsForCharacterName = (characterName, limit, offset) => {
    searchCharacter(characterName, limit, offset).then(characterObject => {
        comics = characterObject.getComics();
        total = characterObject.getTotal();
        pageCount = Math.ceil(total/limit);
    
        const attributionHTML = characterObject.getAttributionHTML();
        const comicsTableContainer = document.getElementById('comics-table-container');
        const comicsTable = document.createElement('table');
        comicsTable.id = 'comics-table'
    
        const comicsHeader = comicsTable.createTHead();
        const comicsRow = comicsHeader.insertRow();
    

        const indexTh = document.createElement('th');
        indexTh.textContent = "#";
        comicsRow.appendChild(indexTh);
        
        const comicsTh = document.createElement('th');
        comicsTh.textContent = "COMICS";
        comicsRow.appendChild(comicsTh);

        const coverArtTh = document.createElement('th');
        coverArtTh.textContent = "COVER ART";        
        comicsRow.appendChild(coverArtTh);

        // Create table rows and cells
        for(let i=0; i<comics.length; i++) {      
            const tableRow = comicsTable.insertRow();

            const comicRowNumber = tableRow.insertCell();
            comicRowNumber.textContent = i + offset + 1;

            const comicCell = tableRow.insertCell();
            const linkCell = tableRow.insertCell();

            // Set the cell widths
            comicCell.style.width = '1000px';
            linkCell.style.width = '100px';

            // Set cell alignment
            linkCell.style.textAlign = 'center';

            comicCell.textContent = comics[i].title;            

            if(comics[i].images.length) {  
                const link = document.createElement('a');
                const portrailUncannyURL = `${comics[i].images[0].path}/portrait_uncanny.${comics[i].images[0].extension}`;
                const linkURL = `${comics[i].images[0].path}/portrait_small.${comics[i].images[0].extension}`;

                const image = document.createElement('img');
                image.src = linkURL;
                image.alt = "Link"
                
                const largeImageSrc = portrailUncannyURL;
                const largeImage = document.createElement('img');
                largeImage.src = largeImageSrc;
                largeImage.width *= 4;
                largeImage.height *= 4;
                image.largeImage = largeImage;

                // Set the width and height attributes of the image
                image.style.width = 50;
                image.style.height = 75;
                
                link.href = linkURL;
                linkCell.append(image);
            }
            //tableRow.style.borderBottom = '1px solid black'
            comicsTable.append(tableRow);
        }

        comicsTableContainer.appendChild(comicsTable);

        nextButton.classList.remove('hidden');
        prevButton.classList.remove('hidden');

        displayAttribution(attributionHTML); 
    });    
}

getCoverArtImageSmall = (url, size, type) => {
    url = `${url}/portrait_xlarge.${type}`;    
    displayComicCover(url)
    
}

// Function to display attribution HTML in your page
function displayAttribution(attributionHTML) {
    const attributionContainer = document.getElementById('attributionContainer');
    attributionContainer.innerHTML = attributionHTML;
}

async function searchCharacter(characterName, limit, offset) {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const baseUrl = `https://gateway.marvel.com/v1/public/characters`;

    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${encodeURIComponent(characterName)}`;

    // Check where character id exists in the session storage        
    if(localStorage.getItem(characterName) !== null) {
        
        //const characterId = sessionStorage.getItem(characterName);
        const characterId = localStorage.getItem(characterName);
            
        // Now that you have the character ID, you can fetch comics list
        return fetchComicsForCharacter(characterId, limit, offset).then(comicsJson => {
            return new Character(characterId, characterName, comicsJson);
        });          
    }

    // Otherwise fetch the character id 
    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(responseJson) {        
        const character = responseJson.data.results[0]; 

        if (character) {
            // Retrieve the character ID
            const characterId = character.id;             
        
            //sessionStorage.setItem(characterName, characterId);
            localStorage.setItem(characterName, characterId);

            // Now that you have the character ID, you can fetch comics list
            return fetchComicsForCharacter(characterId, limit, offset).then(comicsJson => {            
                return new Character(characterId, characterName, comicsJson);
            });            
        } else {
            console.error('Character not found');
        }
    })
    .catch(error => {
        console.error('Error searching character:', error);
    });
}

async function fetchComicsForCharacter(characterId, limit, offset) {

    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const baseUrl = `https://gateway.marvel.com/v1/public/characters/${characterId}/comics`;

    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;

    // Calculate current page number a 
    const currentPageNumber = Math.floor(offset/limit) + 1
    const key = `${characterId}-${currentPageNumber}`;

    // Check where character id exists in the session storage    
    if(localStorage.getItem(key) !== null) {        
        const responseJson = JSON.parse(localStorage.getItem(key));
        
        // Return the list of comics from the session storage
        return responseJson;     
    }

    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
    })
    .then(function(responseJson) {              
        //sessionStorage.setItem(key, JSON.stringify(responseJson));
        localStorage.setItem(key, JSON.stringify(responseJson));

        return responseJson;
    })
    .catch(error => {
        console.error('Error fetching comics:', error);
    });
}