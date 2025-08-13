(function () {
  // mm:ss formatter
  function fmt(t){
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Build a convenient array of transcript lines with start/end + node
  function getTranscriptLines(){
    const nodes = Array.from(document.querySelectorAll("#transcript p[data-start][data-end]"));
    return nodes.map(node => ({
      node,
      start: parseFloat(node.dataset.start),
      end:   parseFloat(node.dataset.end)
    }));
  }

  // Highlight helper
  function highlightAt(time, lines){
    lines.forEach(({node, start, end}) => {
      const active = time >= start && time < end;
      node.classList.toggle("highlight", active);
    });
  }

  function init(){
    if (!window.WaveSurfer) {
      console.error("WaveSurfer not found. Check script include order/paths.");
      return;
    }

    const media   = document.getElementById("about-audio");  // <audio id="about-audio" src="assets/audio/intro.mp3">
    const playBtn = document.getElementById("btnPlay");
    const timeEl  = document.getElementById("time");
    const wfEl    = document.getElementById("waveform");
    if (!media || !wfEl || !playBtn || !timeEl) return;

    // Create WaveSurfer v7 using the existing <audio> element
    const ws = WaveSurfer.create({
      container: "#waveform",
      backend: "mediaelement",
      media,                       // reuse your <audio> element/path
      waveColor: "#c9c9cf",
      progressColor: "#111111",
      cursorColor: "#111111",
      height: 120,
      barWidth: 2,
      barGap: 2,
      responsive: true
    });

    // Transcript lines
    const lines = getTranscriptLines();

    // Click a line to jump & play
    lines.forEach(({node, start}) => {
      node.addEventListener("click", () => {
        ws.setTime(start);
        ws.play();
      });
    });

    // UI wiring
    ws.on("ready", () => {
      timeEl.textContent = `0:00 / ${fmt(ws.getDuration())}`;
      highlightAt(0, lines);
    });

    playBtn.addEventListener("click", () => ws.playPause());
    ws.on("play", () => {
      playBtn.innerHTML = "⏸"; // Pause symbol
      playBtn.setAttribute("aria-label", "Pause");
    });
    
    ws.on("pause", () => {
      playBtn.innerHTML = "▶"; // Play symbol
      playBtn.setAttribute("aria-label", "Play");
    });

    // Keep time + highlight in sync while playing
    ws.on("timeupdate", (t) => {
      timeEl.textContent = `${fmt(t)} / ${fmt(ws.getDuration())}`;
      highlightAt(t, lines);
    });

    // Also update highlight after manual seeking
    ws.on("seek", (progress) => {
      const t = progress * ws.getDuration();
      highlightAt(t, lines);
      timeEl.textContent = `${fmt(t)} / ${fmt(ws.getDuration())}`;
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();