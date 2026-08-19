const clock=document.getElementById("clock");

function updateClock(){

    const now=new Date();

    clock.textContent=now.toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit"

    });

}

export function startClock() {
  updateClock();
  setInterval(updateClock,1000);
}