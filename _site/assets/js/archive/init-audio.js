(function () {
  function fmt(t){ if(!isFinite(t)) return "0:00";
    const m=Math.floor(t/60), s=Math.floor(t%60).toString().padStart(2,"0");
    return `${m}:${s}`; }

  function init(){
    if(!window.WaveSurfer){ console.error("WaveSurfer missing"); return; }

    const media = document.getElementById("about-audio");
    const play  = document.getElementById("btnPlay");
    const time  = document.getElementById("time");

    if(!media){ console.error("#about-audio not found"); return; }

    const ws = WaveSurfer.create({
      container: "#waveform",
      backend: "mediaelement",      // use the existing <audio>
      media,                        // <- this is key
      waveColor: "#c9c9cf",
      progressColor: "#111111",
      cursorColor: "#111111",
      height: 120,
      barWidth: 2,
      barGap: 2,
      responsive: true
    });

    ws.on("ready", () => { time.textContent = `0:00 / ${fmt(ws.getDuration())}`; });
    ws.on("error", e => console.error("WaveSurfer error:", e));

    play.addEventListener("click", () => ws.playPause());
    ws.on("play",  () => play.textContent = "Pause");
    ws.on("pause", () => play.textContent = "Play");
    ws.on("timeupdate", t => time.textContent = `${fmt(t)} / ${fmt(ws.getDuration())}`);
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();