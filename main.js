const synth = window.speechSynthesis;

const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const nameInput = document.querySelector("#name-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const pitch = document.querySelector("#pitch");
const row = document.querySelector(".row");

let voices = [];

const errorMessage = document.createElement("div");
errorMessage.classList.add("text-danger", "mt-1");
errorMessage.style.display = "none"; 
textInput.parentNode.appendChild(errorMessage);

const getVoices = () => {
    voices = synth.getVoices();
  
    voices.sort((a, b) => {
      if (a.lang === 'tr-TR' || a.lang === 'en-US') return -1; 
      if (b.lang === 'tr-TR' || b.lang === 'en-US') return 1;
      return 0;  
    });
  
    voiceSelect.innerHTML = "";
  
    voices.forEach(voice => {
        const option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
  
        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        voiceSelect.appendChild(option);
    });
  };
  
  getVoices();
  
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
  }

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

const validateInput = () => {
    let text = textInput.value.trim();

    if (text.length < 1) {
        errorMessage.textContent = "Please enter at least 1 characters!";
        errorMessage.style.display = "block"; 
        textInput.classList.add("is-invalid");
        return false;
    }

    errorMessage.style.display = "none";
    textInput.classList.remove("is-invalid");
    return true;
};

textInput.addEventListener("input", validateInput);

const speak = () => {
    if (!validateInput()) return;

    synth.cancel();

    row.style.background = "#141414 url(../images/wave.gif)";
    row.style.backgroundRepeat = "repeat-x";
    row.style.backgroundSize = "100% 100%";

    const speakText = new SpeechSynthesisUtterance(textInput.value + "yala beni " + nameInput.value);

    speakText.onend = () => {
        console.log("Done speaking...");
        row.style.background = "none";
    };

    speakText.onerror = () => {
        console.error("Something went wrong...");
    };

    const selectedVoice = voiceSelect.selectedOptions[0]?.getAttribute("data-name");
    if (!selectedVoice) return;

    voices.forEach(voice => {
        if (voice.name === selectedVoice) {
            speakText.voice = voice;
        }
    });

    speakText.rate = parseFloat(rate.value);
    speakText.pitch = parseFloat(pitch.value);

    synth.speak(speakText);
};

textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
});
