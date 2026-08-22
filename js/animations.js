const boot = document.getElementById("boot-screen");
const bootText = document.getElementById("boot-text");
const dashboard = document.querySelector(".dashboard");
const musicPlayer = document.querySelector(".music-player");
const bgVideo = document.querySelector('.background video');

// Если видео не найдено/не загружается — скрываем блок background
if (bgVideo) {
  bgVideo.addEventListener('error', () => {
    const bg = document.querySelector('.background');
    if (bg) bg.style.display = 'none';
  });
}

if (!boot || !bootText || !dashboard) {
  console.warn("Boot animation skipped: required DOM elements are missing.");
} else {
  const messages = [
    "INITIALIZING...",
    "CONNECTING...",
    "LOADING MODULES...",
    "ACCESS GRANTED",
    "WELCOME BACK",
  ];

  let i = 0;

  const interval = setInterval(() => {
    i += 1;
    if (i < messages.length) {
      bootText.textContent = messages[i];
    }
  }, 600);

  setTimeout(() => {
    clearInterval(interval);
    boot.style.opacity = "0";
    boot.style.transition = "1s";
    dashboard.classList.remove("hidden");
    dashboard.style.opacity = "1";
    if (musicPlayer) {
      musicPlayer.classList.remove("hidden");
      musicPlayer.style.opacity = "1";
    }
    // Restart CSS animations for elements inside dashboard/music player
    const restartAnimations = (root) => {
      if (!root) return;
      const elems = root.querySelectorAll('[class*="animate-"]');
      elems.forEach(el => {
        // collect animate-* classes
        const animateClasses = Array.from(el.classList).filter(c => c.startsWith('animate-'));
        // temporarily remove and re-add to retrigger animation
        animateClasses.forEach(c => el.classList.remove(c));
        // force reflow
        void el.offsetWidth;
        animateClasses.forEach(c => el.classList.add(c));
      });
    };

    // small delay so DOM updates take effect, then restart
    setTimeout(() => {
      restartAnimations(dashboard);
      if (musicPlayer) restartAnimations(musicPlayer);
    }, 60);
    boot.style.display = "none";
  }, 3500);

  setTimeout(() => {
    boot.remove();
  }, 4500);
}

