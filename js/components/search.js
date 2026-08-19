const searchInput = document.getElementById("search");
const searchImg = document.getElementById("searchImg");
const searchVid = document.getElementById("searchVid");

export function initSearch() {
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        window.location.href =
          "https://www.google.com/search?q=" + encodeURIComponent(searchInput.value);
      }
    });
  }

  if (searchImg) {
    searchImg.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchImg.value.trim()) {
        window.location.href =
          "https://ya.ru/images/search?from=tabbar&text=" +
          encodeURIComponent(searchImg.value);
      }
    });
  }

  if (searchVid) {
    searchVid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchVid.value.trim()) {
        window.location.href =
          "https://www.youtube.com/results?search_query=" +
          encodeURIComponent(searchVid.value);
      }
    });
  }
}
