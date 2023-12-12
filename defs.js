
class Character {
    constructor(id, name, comicsJson)
    {
        console.log("start Character");
        let Id = id;
        console.log(Id);
        let Name = name;        
        console.log(Name);
        console.log("Character Constructor:");
        console.log(comicsJson);
        let Comics = comicsJson.data.results;
        let Total = comicsJson.data.total;
        let AttributionHTML = comicsJson.attributionHTML;
        
        console.log(Comics);
        console.log(Total);
        console.log("start Character");

        this.getId = function() {
            return Id;
        }

        this.getName = function() {
            return Name;
        }

        this.getComics = function() {
            return Comics;
        }

        this.getTotal = function() {
            return Total;
        }

        this.getAttributionHTML = function() {
            return AttributionHTML;
        }
    }
}

async function searchCharacter(characterName, limit, offset) {
    console.log(`characterName: ${characterName}`);
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const baseUrl = `https://gateway.marvel.com/v1/public/characters`;

    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=${encodeURIComponent(characterName)}`;

    // Check where character id exists in the session storage    
    //if(sessionStorage.getItem(characterName) !== null) {
    
    if(localStorage.getItem(characterName) !== null) {
        
        //const characterId = sessionStorage.getItem(characterName);
        const characterId = localStorage.getItem(characterName);
            
        console.log(`getting from storage:`);
        console.log(characterId);
    
        // Now that you have the character ID, you can fetch comics list
        return fetchComicsForCharacter(characterId, limit, offset).then(comicsJson => {
            console.log(`searchCharacter fetchComicsForCharacter localStorage:`);
            console.log(comicsJson);
    
            return new Character(characterId, characterName, comicsJson);
        });  
        
        //return fetchComicsForCharacter(characterId, limit, offset);    
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
        console.log(responseJson);
        const character = responseJson.data.results[0]; 

        if (character) {
            // Retrieve the character ID
            const characterId = character.id; 
            console.log('Character ID:', characterId);
        
            //sessionStorage.setItem(characterName, characterId);
            localStorage.setItem(characterName, characterId);

            // Now that you have the character ID, you can fetch comics list
            return fetchComicsForCharacter(characterId, limit, offset).then(comicsJson => {            
                console.log(`searchCharacter fetched comics:`);
                console.log(comicsJson);               

                return new Character(characterId, characterName, comicsJson);

                //return value;
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
    //if(sessionStorage.getItem(key) !== null) {        
    //    const responseJson = JSON.parse(sessionStorage.getItem(key));
    if(localStorage.getItem(key) !== null) {        
        const responseJson = JSON.parse(localStorage.getItem(key));
        
        console.log(`getting responseJson from storage:`);
        console.log(responseJson);


        // Return the list of comics from the session storage
        return responseJson;     

        //return new Character(responseJson);
    }

    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
    })
    .then(function(responseJson) {
        console.log(`fetchComicsForCharacter:`);
        console.log(responseJson);
              
        //sessionStorage.setItem(key, JSON.stringify(responseJson));
        localStorage.setItem(key, JSON.stringify(responseJson));

        //return new Character(responseJson);        

        return responseJson;
    })
    .catch(error => {
        console.error('Error fetching comics:', error);
    });
}