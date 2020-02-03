document.addEventListener("DOMContentLoaded", 
  function(event) {
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
      ingredient = ingredient.replace(/[^A-Za-z]/g, "").toLowerCase();
      if(ingredient != "")
        ingredients.add(ingredient);
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
      async function syncFetch(url) {
        let response = await fetch(url, {"method": "GET"});
        let data = await response.json();
        return data;
      }

      function throwError(message) {
        let error = document.createElement("div");
        let img = document.createElement("img");
        let desc = document.createElement("div");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");

        error.setAttribute("style", "margin-left: auto; margin-right: auto; margin-top: 10px; max-width: 70%;");
        img.setAttribute("src", "images/sad-face.jpg");
        img.setAttribute("style", "float: left; background-color: black;");
        desc.setAttribute("style", "height: 200px; background-color: lightgray; opacity: 60%; text-align: left;");
        h3.setAttribute("style", "font-size: large;");
        p.setAttribute("style", "font-size: medium;");
        h3.textContent = message;
        if(message == "No recipes available")
          p.textContent = "I'm sorry, I couldn't think of any recipes that fit your list of ingredients. I think it's time to refresh your pantry and hit your local supermarket!";
        else if(message == "Unrecognized ingredient(s)")
          p.textContent = "I'm sorry, I didn't recognize one or more of the ingredients that you submitted. Please revise and resubmit your list.";
        else
          p.textContent = "I'm sorry, recipes are in high demand today. I had to take a break and step out for a coffee. Please resubmit your list in a few minutes.";

        desc.appendChild(h3);
        desc.appendChild(p);
        error.appendChild(img);
        error.appendChild(desc);
        grid.appendChild(error); 
      }

      event.preventDefault();
      if(submitted)
        return;
      submitted = true;
      while(grid.firstChild)
        grid.removeChild(grid.firstChild);
      if(ingredients.size == 0) {
        throwError("Unrecognized ingredient(s)");
        return;
      }
      let url = "https://api.edamam.com/search?q=";
      ingredients.forEach(ingredient => {
        if(ingredient != "")
          url += ingredient + "%20";
      });
      url = url.substring(0, url.length - 3);
      url += "&app_id=" + process.env.API_ID + "&app_key=" + process.env.API_KEY;
      syncFetch(url)
        .then(data => {
          if(data.count == 0)
            throwError("No recipes available");
          data.hits.forEach(hit => {
            let recipe = document.createElement("div");
            let img = document.createElement("img");
            let a = document.createElement("a");

            recipe.setAttribute("style", "height: 230px; width: 200px; float: left; margin-top: 10px; margin-bottom: 10px; margin-left: 20px; margin-right: 20px");
            img.setAttribute("src", `${hit.recipe.image}`);
            img.setAttribute("alt", " ");
            let label = `${hit.recipe.label}`;
            if(label.length > 21)
              label = label.substring(0, 19) + ".."; 
            a.textContent = label;
            a.setAttribute("href", `${hit.recipe.url}`);
            a.setAttribute("target", "_blank");

            recipe.appendChild(img);
            recipe.appendChild(a); 
            grid.appendChild(recipe);
          });
        })
        .catch(err => {
          throwError("API call limit exceeded");
        });
    }
  }
)
