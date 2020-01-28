document.addEventListener("DOMContentLoaded", 
  function(event) {
    require("dotenv").config();
    let ingredients = new Set();
    let submitted = true;
    let form = document.getElementById("ingredient-form");
    let list = document.getElementById("ingredient-list");
    let grid = document.getElementById("recipe-grid");
    form.addEventListener("submit", add); 
    form.addEventListener("reset", reset);
    document.getElementById("ingredient-submit").onclick = submit;

    function add(event) {
      event.preventDefault();
      let ingredient = document.getElementById("ingredient-input").value;
      document.getElementById("ingredient-input").value = "";
      let li = document.createElement("li");
      li.textContent = `${ingredient}`;
      list.appendChild(li);
      ingredients.add(ingredient.replace(/[^A-Za-z]/g, "").toLowerCase());
      submitted = false;
    }

    function reset(event) {
      event.preventDefault();
      while(list.firstChild)
        list.removeChild(list.firstChild);
      while(grid.firstChild)
        grid.removeChild(grid.firstChild);
      ingredients = new Set();
      submitted = true;
    }

    function submit(event) {
      syncFetch = async(url) => {
        let response = await fetch(url, {"method": "GET", "headers": {"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com", "x-rapidapi-key": process.env.RFN_KEY}});
        let data = await response.json();
        return data;
      }

      function throwError(message) {
        let error = document.createElement("div");
        let img = document.createElement("img");
        let desc = document.createElement("div");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");

        error.setAttribute("style", "margin-bottom: 10px;");
        img.setAttribute("src", "images/unhappy-face.jpg");
        img.setAttribute("style", "background-color: black;");
        desc.setAttribute("style", "height: 250px; overflow: scroll; background-color: lightgray; opacity: 60%;");
        h3.textContent = message;
        if(message == "No recipes found")
          p.textContent = "I'm sorry, I couldn't think of any recipes that fit your list of ingredients. I think it's time to refresh your pantry and hit your local supermarket!";
        else
          p.textContent = "I'm sorry, recipes are in high demand today. I have to take a break now, but I will be back again tomorrow!";

        desc.appendChild(h3);
        desc.appendChild(p);
        error.appendChild(img);
        error.appendChild(desc); 
        grid.appendChild(error); 
      }

      function searchId() {
        url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=2&ignorePantry=true&ingredients=";
        ingredients.forEach(ingredient => {
          if(ingredient != "")
            url += ingredient + "%252C";
        });
        url = url.substring(0, url.length - 5);
        syncFetch(url)
          .then(data => {
            data.forEach(identifier => {
              identifiers.add(identifier.id);
            });
          })
          .catch(err => {
            throwError("No recipes found");
          });
      }

      function searchRecipe() {
        identifiers.forEach(identifier => {
          url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + identifier + "/information";
          syncFetch(url)
            .then(data => {
              let recipe = document.createElement("div");
              let img = document.createElement("img");
              let desc = document.createElement("div");
              let h3 = document.createElement("h3");
              let p1 = document.createElement("p");
              let p2 = document.createElement("p");

              recipe.setAttribute("style", "margin-bottom: 10px;");
              img.setAttribute("src", `${data.image}`);
              img.setAttribute("alt", " ");
              desc.setAttribute("style", "height: 250px; overflow: scroll; background-color: lightgray; opacity: 60%;");
              p2.setAttribute("style", "text-align: right; font-size: small;");
              h3.textContent = `${data.title}`;
              p1.textContent = `${data.instructions}`;
              p2.textContent = "[" + `${data.sourceName}` + "]"; 

              desc.appendChild(h3);
              desc.appendChild(p1);
              desc.appendChild(p2);
              recipe.appendChild(img);
              recipe.appendChild(desc); 
              grid.appendChild(recipe);
            })
            .catch(err => {
              throwError("No recipes found");
            });
        });
      }

      syncSearch = async() => {
        setTimeout(searchRecipe, 1000);
        await searchId();
        await searchRecipe();
      }
  
      event.preventDefault();
      if(submitted)
        return;
      while(grid.firstChild)
        grid.removeChild(grid.firstChild);
      let identifiers = new Set();
      let url = "";
      syncSearch();
      submitted = true;
    }
  }
)
