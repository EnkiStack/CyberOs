const nofications = document.getElementById("nofications");
const textNofication = document.getElementById("textNofication");
const okeyBtn = document.querySelector(".okey-btn");

export function noficationsLog(text) {
  nofications.classList.add("show");

  textNofication.textContent = text;
}

export function initNofication() {
  okeyBtn.addEventListener("click", () => {
    nofications.classList.remove("show");
  });
}