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
      event.preventDefault();
      if(submitted)
        return;
      while(grid.firstChild)
        grid.removeChild(grid.firstChild);

      let message = document.createElement("div");
      let img = document.createElement("img");
      let desc = document.createElement("div");
      let h3 = document.createElement("h3");
      let p = document.createElement("p");

      message.setAttribute("style", "margin-bottom: 10px;");
      img.setAttribute("src", "images/unhappy-face.jpg");
      img.setAttribute("style", "background-color: black;");
      desc.setAttribute("style", "height: 250px; overflow: scroll; background-color: lightgray; opacity: 60%;");
      h3.textContent = "Functionality under maintenance";
      p.textContent = "I'm sorry, this functionality is currently undergoing some changes to improve the user experience. I expect to be up and running later this week!";

      desc.appendChild(h3);
      desc.appendChild(p);
      message.appendChild(img);
      message.appendChild(desc); 
      grid.appendChild(message); 

      submitted = true;
    }
  }
)
