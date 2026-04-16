import { ElementBuilder, ParentChildBuilder } from "./builders.js";

class ParagraphBuilder extends ParentChildBuilder {
  constructor() {
    super("p", "span");
  }
}

class ListBuilder extends ParentChildBuilder {
  constructor() {
    super("ul", "li");
  }
}

function formatRuntime(runtime) {
  const hours = Math.trunc(runtime / 60);
  const minutes = runtime % 60;
  return hours + "h " + minutes + "m";
}

function appendMovie(movie, element) {
  new ElementBuilder("article").id(movie.imdbID)
          .append(new ElementBuilder("img").with("src", movie.Poster))
          .append(new ElementBuilder("h1").text(movie.Title))
          .append(new ElementBuilder("p")
              .append(new ElementBuilder("button").class("edit").text("Edit")
                    .listener("click", () => location.href = "edit.html?imdbID=" + movie.imdbID)))
          .append(new ParagraphBuilder().items(
              "Runtime " + formatRuntime(movie.Runtime),
              "\n", "Released on " + movie.Released))
          .append(new ParagraphBuilder().class("genres").childClass("genre").items(movie.Genres))
          .append(new ElementBuilder("p").class("plot").text(movie.Plot))
          .append(new ElementBuilder("h2").pluralizedText("Director", movie.Directors))
          .append(new ListBuilder().class("directors").items(movie.Directors))
          .append(new ElementBuilder("h2").pluralizedText("Writer", movie.Writers))
          .append(new ListBuilder().class("writers").items(movie.Writers))
          .append(new ElementBuilder("h2").pluralizedText("Actor", movie.Actors))
          .append(new ListBuilder().class("actors").items(movie.Actors))
          .appendTo(element);
}

function loadMovies(genre) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove()
    }

    if (xhr.status === 200) {
      const movies = JSON.parse(xhr.responseText)
      for (const movie of movies) {
        appendMovie(movie, mainElement)
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  }

  const url = new URL("/movies", location.href)
  /* Task 1.4. Add query parameter to the url if a genre is given */

  if (genre){
    url.searchParams.set("Genres", genre)
  }
  xhr.open("GET", url)
  xhr.send()
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const listElement = document.querySelector("nav>ul");

    if (xhr.status === 200) {
      /* Task 1.3. Add the genre buttons to the listElement and 
         initialize them with a click handler that calls the 
         loadMovies(...) function above. */
      const genres = JSON.parse(xhr.responseText);
      const buttonAll = document.createElement("button")
      buttonAll.onclick = () => {loadMovies()}
      buttonAll.textContent = "All";
      listElement.appendChild(buttonAll);
      genres.forEach(genre => {
        const button = document.createElement("button");
        button.onclick = () => (loadMovies(genre));
        button.textContent = genre;
        listElement.appendChild(button);
      })

      /* When a first button exists, we click it to load all movies. */
      const firstButton = document.querySelector("nav button");
      if (firstButton) {
        firstButton.click();
      }
      document.append(listElement);
    } else {
      document.querySelector("body").append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
  xhr.open("GET", "/genres");
  xhr.send();
};
