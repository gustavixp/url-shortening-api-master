// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-              H A M B   M E N U              -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function toggleMenu() {
  const nav = document.querySelector(".nav");
  nav.classList.toggle("active");
}
function closeMenu(e) {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".hamb");
  if (
    nav.classList.contains("active") &&
    !hamburger.contains(e.target) &&
    !nav.contains(e.target)
  ) {
    nav.classList.remove("active");
  }
}
const hamburger = document.querySelector(".hamb");
hamburger.addEventListener("click", toggleMenu);
document.addEventListener("click", closeMenu);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-                  S H O R T                  -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const form = document.querySelector("#short__form");
const input = document.querySelector(".short__input");
const resultsWrapper = document.querySelector(".results__wrapper");

let links = [];

function createLinkElement(link) {
  const container = document.createElement("div");
  container.classList.add("result__container");

  const close = document.createElement("i");
  close.classList.add("close", "fa-solid", "fa-rectangle-xmark");
  close.addEventListener("click", () => {
    links = links.filter((l) => l.short_link !== link.short_link);
    container.remove();
  });

  const og = document.createElement("p");
  og.classList.add("link__og");
  og.textContent = link.original_link;

  const line = document.createElement("div");
  line.classList.add("line__result");

  const newLink = document.createElement("p");
  newLink.classList.add("link__new");
  newLink.textContent = link.short_link;
  newLink.addEventListener("click", () => {
    navigator.clipboard.writeText(link.short_link).then(() => {
      copy.classList.add("copied");
    });
  });

  const copy = document.createElement("a");
  copy.classList.add("copy");
  copy.addEventListener("click", () => {
    navigator.clipboard.writeText(link.short_link).then(() => {
      copy.classList.add("copied");
    });
  });

  container.appendChild(close);
  container.appendChild(og);
  container.appendChild(line);
  container.appendChild(newLink);
  container.appendChild(copy);

  return container;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value) {
    alert("Please enter a valid URL");
    return;
  }
  fetch(`https://api.shrtco.de/v2/shorten?url=${input.value}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        const link = {
          original_link: data.result.original_link,
          short_link: data.result.short_link,
        };
        links.push(link);
        const container = createLinkElement(link);
        resultsWrapper.appendChild(container);
        input.value = "";
      } else {
        alert("Please enter a valid URL");
      }
    })
    .catch((error) => {
      alert("An error occurred, please try again later");
    });
});

window.addEventListener("load", () => {
  const storedLinks = JSON.parse(localStorage.getItem("links")) || [];
  links = storedLinks;
  links.forEach((link) => {
    const container = createLinkElement(link);
    resultsWrapper.appendChild(container);
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("links", JSON.stringify(links));
});
