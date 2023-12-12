
// Marvel API Base URL
const baseUrl = 'https://gateway.marvel.com';


// Marvel API Endpoints
const charactersEndpoint = 'v1/public/characters';
const comicsEndpoint = 'v1/public/comics';
const creatorsEndpoint = 'v1/public/creators'
const eventsEndpoint = 'v1/public/events'
const seriesEndpoint = 'v1/public/series';
const storiesEndpoint = 'v1/public/stories'

// Form Element
const form = document.getElementById('search-form');
const searchfield = document.getElementById("search-field"); 
const comicsTableContainer = document.getElementById('comics-table-container');
const seriesTableContainer = document.getElementById('series-table-container');
const eventsTableContainer = document.getElementById('events-table-container');

// Get the current timestamp in seconds
const timestampInSeconds = Math.floor(Date.now() / 1000);
console.log('Timestamp in seconds:', timestampInSeconds);

const ts = new Date().getTime();

//hashSeed = `${timestampInSeconds}${PRIVATE_API_KEY}${PUBLIC_API_KEY}`
hashSeed = `${ts}${privateKey}${publicKey}`

const hash = CryptoJS.MD5(hashSeed).toString();
console.log('Marvel MD5 hash:', hash);

//const url = `${baseUrl}/${resource}?ts=${timestampInSeconds}&apikey=${publicKey}&hash=${hash}`;

let total = 0;
let pageCount = 1;
let currentPage = 1;

const limit = 20;
let offset = 0;

const EndpointType = {
    Character: Symbol('character'),
    Comics: Symbol('comics')
}


let authenticationUrl = `${baseUrl}/${charactersEndpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
//let authenticationUrl = `${baseUrl}/${charactersEndpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${encodeURIComponent(character)}&limit=30`;
//const charactersUrl = `${baseUrl}/${charactersEndpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${encodeURIComponent(character)}&limit=30`;
//const comicsUrl = `${baseUrl}/${comicsEndpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&title=${encodeURIComponent(title)}&limit=30`;
//const characterLookupUrl = `${baseUrl}:443/${characters}?name=${encodeURIComponent(character)}?apikey=${PUBLIC_API_KEY}`;
//const characterLookupUrl = `${baseUrl}/${characters}?ts=${timestampInSeconds}&apikey=${PUBLIC_API_KEY}&hash=${hash}`;

//const comicUrl = `${baseUrl}/${comics}/3193?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

//url = characterUrl;

function clearTable(tableName) {
    const table = document.getElementById(tableName);
    if(table !== null) {
        table.innerHTML = ''; // Clear the table content
    }
}

const submitButton = document.getElementById('submit-btn');
form.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Submit Pressed");

    //allComics = [];
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';

    const searchWords = searchfield.value;
    console.log(`searchWords: ${searchWords}`);

    const starting_offset = 0;
    //fetchCharacterData(searchWords, starting_offset);
    displayComicsForCharacterName(searchWords, 20, 0);
});

const nextButton = document.getElementById('next-btn');
nextButton.addEventListener('click', function(e) {
    e.preventDefault();

    currentPage = total / limit

    if(offset + limit <= total) {
        offset += limit;
    }
    console.log(`offset: ${offset}`);

    //allComics = [];
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';


    const searchWords = searchfield.value;
    console.log(`searchWords: ${searchWords}`);
    displayComicsForCharacterName(searchWords, limit, offset);
});

const prevButton = document.getElementById('prev-btn');
prevButton.addEventListener('click', function(e) {
    e.preventDefault();
    if(offset > 0) {
        offset -= limit;
    }
    console.log(`offset: ${offset}`);

   // allComics = [];
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';


    const searchWords = searchfield.value;
    console.log(`searchWords: ${searchWords}`);
    displayComicsForCharacterName(searchWords, limit, offset);
});

const clearButton = document.getElementById('clear-btn');
clearButton.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Clear Pressed");
    comicsTableContainer.innerHTML = '';
    seriesTableContainer.innerHTML = '';
    eventsTableContainer.innerHTML = '';

    nextButton.classList.add('hidden');
    prevButton.classList.add('hidden');
});

function getUrl(endpointType, character, limit, offset) {
    if(endpointType === EndpointType.Character) {
      return `${authenticationUrl}&name=${encodeURIComponent(character)}&limit=${limit}&offset=${offset}`;
    } else if (endpointType === EndpointType.Comics) {
      return `${authenticationUrl}&title=${encodeURIComponent(title)}&limit=30`
    }
}

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
    console.log(`displayComicsForCharacterName, characterName: ${characterName}`);
    //searchCharacter(characterName, limit, offset).then(responseJson => {
    searchCharacter(characterName, limit, offset).then(characterObject => {
        //console.log(`displayComicsForCharacterName responsJson:`);
        //console.log(responseJson);
    
        //const comics = responseJson.data.results;
        comics = characterObject.getComics();
        console.log("displayComicsForCharacterName comics:");
        console.log(comics);
        //total = responseJson.data.total;
        total = characterObject.getTotal();
        pageCount = Math.ceil(total/limit);
        console.log(`pageCount: ${pageCount}`);
        //const attributionHTML = responseJson.attributionHTML;
        const attributionHTML = characterObject.getAttributionHTML();


        console.log(`fetchedComics:`);
        console.log(comics);
        const comicsTableContainer = document.getElementById('comics-table-container');
        const comicsTable = document.createElement('table');
        comicsTable.id = 'comics-table'
        //comicsTable.style.border = '1px solid black'
        const comicsHeader = comicsTable.createTHead();
        const comicsRow = comicsHeader.insertRow();
        //comicsRow.style.borderBottom = '1px solid black'

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

            //console.log(comicsItems[i].name);
            //console.log(comics[i].title);
            comicCell.textContent = comics[i].title;            

            if(comics[i].images.length) {  
                const link = document.createElement('a');
                //console.log(`${comics[i].images[0].path}/portrait_incredible/`);
                //console.log(`${comics[i].images[0].path}/landscape_incredible/`);
                //console.log(`${comics[i].images[0].extension}`);
                const portrailUncannyURL = `${comics[i].images[0].path}/portrait_uncanny.${comics[i].images[0].extension}`;
                const linkURL = `${comics[i].images[0].path}/portrait_small.${comics[i].images[0].extension}`;

                const image = document.createElement('img');
                image.src = linkURL;
                //image.largeSrc = portrailUncannyURL;
                image.alt = "Link"
                
                const largeImageSrc = portrailUncannyURL;
                const largeImage = document.createElement('img');
                largeImage.src = largeImageSrc;
                largeImage.width *= 4; // Set the desired width
                largeImage.height *= 4;
                image.largeImage = largeImage;

                // Set the width and height attributes of the image
                image.style.width = 50; // Set the desired width
                image.style.height = 75; // Set the desired height

                //console.log(linkURL);
                link.href = linkURL;
                //link.textContent = "Link";
                //linkCell.append(link);
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
    console.log(url);
    displayComicCover(url)
    
}

//let allComics = [];

fetchCharacterData = (character, offset) => {
    console.log(`fetchCharacterData called`);
    const url = getUrl(EndpointType.Character, character, limit, offset); 

    console.log(`url: ${url}`);
    
    fetch(url)
    .then(response => {
        if(!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        return response.json();
    })
    .then(function(responseJson) {
        console.log(responseJson);
        const results = responseJson.data.results;
        const comics = responseJson.data.results[0].comics;
        //allComics = allComics.concat(comics);
            
        console.log(`comics.length: ${comics.items.length}`);
        //if(comics.items.length === limit) {
        //    offset += limit;    
        //    fetchCharacterData(character, offset);
        //}
        console.log(`offset: ${offset}`);
        //} else {
        //    console.log(allComics);
        //

        //console.log(allComics);
          
        //localStorage.setItem(character, JSON.stringify(allComics));
    
        //createNewCharacter(allComics);
        
        displayAttribution();
    })
    .catch(error => {
        console.error("Error fetching comics", error);
    });
}

// fetchCharacterData = (character) => {
//   const url = getUrl(EndpointType.Character, character); 
//   console.log(`url: ${url}`);
    
//   fetch(url)
//     .then(response => {
//       if(!response.ok) {
//           throw new Error("Network response was not ok");
//       }

//       return response.json();
//     })
//     .then(function(responseJson) {
//       console.log(responseJson);
      
//       localStorage.setItem(character, JSON.stringify(responseJson));
//       const result = responseJson.

//       createNewCharacter(character);

//       displayAttribution();
//   });
// }



//createNewCharacter("Tony Stark");

//fetchCharacterData("Tony Stark", 0);
 
fetchImage = () => {
  const url = getUrl(EndpointType.Comics, title, 20, 0)
  console.log(url);
  fetch(comicUrl)
  .then(response => {
    if(!response.ok) {
        throw new Error("Network response was not ok");
    }
    // Access rate-limiting headers
    const rateLimitLimit = response.headers.get('X-RateLimit-Limit');
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const rateLimitReset = response.headers.get('X-RateLimit-Reset');

    // Use these values to keep track of API usage
    console.log('Rate Limit per Day:', rateLimitLimit);
    console.log('Remaining Calls:', rateLimitRemaining);
    console.log('Time until Reset (in seconds):', rateLimitReset);

    jsonData = response.json();

    return jsonData;
  })
  .then(function(responseJson) {
    console.log(responseJson);
    const attributionHTML = responseJson.attributionHTML;
    displayAttribution(attributionHTML);

    const comic = responseJson.data.results[0];
    if(comic) {
      const coverImage = comic.thumbnail;
      const imageUrl = `${coverImage.path}.${coverImage.extension}`;
      console.log('Cover Image URL:', `${imageUrl}`)
      
      // displayComicCover
      displayComicCover(imageUrl);
    } else {
        console.log('comic not found');
    }
  })
  .catch(error => {
    console.error("Error fetching comic details", error);
  });
}

// Function to display attribution HTML in your page
function displayAttribution(attributionHTML) {
    const attributionContainer = document.getElementById('attributionContainer');
    attributionContainer.innerHTML = attributionHTML;
}