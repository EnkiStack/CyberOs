const music = document.getElementById("music");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const songStatus = document.getElementById("songStatus");


export function initMusic() {
  // Получаем сохранённое состояние
  const savedState = localStorage.getItem("musicState");
  const savedTime = localStorage.getItem("musicTime");


  // Восстанавливаем позицию
  music.addEventListener("loadedmetadata", () => {

      if (savedTime) {
          music.currentTime = Number(savedTime);
      }

  });


  // Если раньше пользователь НЕ ставил на паузу,
  // пытаемся автоматически запустить музыку
  if (savedState !== "paused") {

      music.play()
          .then(() => {
              console.log("Музыка запущена");
          })
          .catch(() => {
              console.log("Браузер ждёт первого действия пользователя");
          });

  }


  // PLAY
  playBtn.addEventListener("click", () => {

      if (music.paused) {

          music.play();

      } else {

          music.pause();

      }

  });
}


// Когда музыка играет
music.addEventListener("play", () => {

    playBtn.textContent = "❚❚";
    songStatus.textContent = "Playing";

    localStorage.setItem("musicState", "playing");

});


// Когда пользователь поставил на паузу
music.addEventListener("pause", () => {

    playBtn.textContent = "▶";
    songStatus.textContent = "Paused";

    localStorage.setItem("musicState", "paused");

});


// Обновляем полоску прогресса
music.addEventListener("timeupdate", () => {

    if (!music.duration) return;

    const value = (music.currentTime / music.duration) * 100;

    progress.value = value;

    // Запоминаем позицию
    localStorage.setItem(
        "musicTime",
        music.currentTime
    );

});


// Пользователь двигает полоску
progress.addEventListener("input", () => {

    if (!music.duration) return;

    music.currentTime =
        (progress.value / 100) * music.duration;

});


// После окончания запускаем сначала
music.addEventListener("ended", () => {

    music.currentTime = 0;
    music.play();

});

// (removed duplicate export) initMusic is defined above and exported once.