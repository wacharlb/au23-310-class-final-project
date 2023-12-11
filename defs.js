/*
class Character {
    constructor(id, name, description, comics, stories, events, series)
    {
        this.id = id;
        this.name = name;
        this.description = description;
        this.comics = comics;
        this.stories = stories;
        this.events = events;
        this.series = series;

        
    }
}*/

//const characterName = 'Thor'; // Replace with the character name you want to search for
let fetchedComics = [];
function searchCharacter(characterName) {
    console.log(`characterName: ${characterName}`);
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const baseUrl = `https://gateway.marvel.com/v1/public/characters`;

    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${encodeURIComponent(characterName)}`;

    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
    })
    .then(function(responseJson) {
        console.log(responseJson);
        const character = responseJson.data.results[0]; // Get the first character from the results
        if (character) {
            const characterId = character.id; // Retrieve the character ID
            console.log('Character ID:', characterId);
        
            // Now that you have the character ID, you can fetch comics or perform other actions
            
            //const comics =  fetchComicsForCharacter(characterId, 0).then(value => {                
            return fetchComicsForCharacter(characterId, 0).then(value => {            
                console.log(`searchCharacter fetched comics:`);
                console.log(value);               

                return value;
            });

            return comics;
        } else {
            console.error('Character not found');
        }
    })
    .catch(error => {
        console.error('Error searching character:', error);
    });
}

// Search for the character by name and retrieve the character ID
//searchCharacter(characterName);


let offset2 = 0;
const limit2 = 20; // Number of comics per page

function fetchComicsForCharacter(characterId, offset) {

    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const baseUrl = `https://gateway.marvel.com/v1/public/characters/${characterId}/comics`;

    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit2}&offset=${offset2}`;

    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
    })
    .then(function(responseJson) {
        //console.log(responseJson);
        //fetchedComics = responseJson.data.results;
        //console.log(responseJson.data.results)
        // Do something with the fetched comics        
        //console.log("fetchComicsForCharacter fetchedComics:");
        //console.log(fetchedComics);     
        
        //return fetchedComics;
        return responseJson;
    })
    .catch(error => {
        console.error('Error fetching comics:', error);
    });
}

//searchCharacter(characterName);

// Fetch the first set of comics for the character
//fetchComicsForCharacter(getCharacterId("Thor"), offset2);

// To fetch the next set of comics (next 20), increment the offset
//offset2 += limit2
//fetchComicsForCharacter(getCharacterId("Thor"), offset2);
