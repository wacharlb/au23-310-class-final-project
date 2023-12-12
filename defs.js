class Character {
    constructor(id, name, comicsJson)
    {        
        let Id = id;     
        let Name = name;                
        let Comics = comicsJson.data.results;
        let Total = comicsJson.data.total;
        let AttributionHTML = comicsJson.attributionHTML;
                
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