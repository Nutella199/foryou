// Personalize these three values when the final confession is ready.
const LETTER = {
  recipient: "Elijah Xavier Racelis",
  sender: "your secret admirer",
  paragraphs: [
    "Hello Elijah, I know I have confessed my feelings before, but I’ll do it again—with a twist. I know you’re very confused why I like you or why I chose to like you. Well, for me there are so many reasons to like you, ja. You may not see it for yourself, but I do.",
    "Maybe at first I was too fast to like you and I thought I was just confused. But as time went by, I realized that I’m not confused. At first I was like, \"bakit siya? ang bilis naman?\" I even told myself na baka infatuation lang or baka namamalikmata lang ako. But no, ja. Habang tumatagal, mas lalo kitang nagugustuhan. It’s not confusion—it’s real. I’m sure now.",
    "Ja, I really, really love your smile and your laugh. Like, super. Your smile is different eh, it’s not just basta smile. When you smile, parang gumagaan lahat, parang nakakalimutan ko lahat ng stress ko. And your laugh? God, your laugh is my favorite sound. Ang cute mo tumawa, nakakahawa, tapos yung mata mo na parang ngumingiti din. I swear I could listen to it all day, kahit paulit-ulit pa. You have no idea how much I love it.",
    "I like you kasi you’re so genuine. You don’t pretend. Kung ano ka, ’yun ka. And that’s rare.",
    "I like you kasi ang bait mo in small ways. Yung mga bagay na akala mo walang nakakapansin, ako napapansin ko. The way you talk, the way you care, the way you try to be there even if di mo sinasabi.",
    "I like you kasi ang gaan mo kasama. Like I can be weird, I can be sobrang kulit, tahimik, maingay, and you never make me feel na ang OA ko or ang weird ko. You make me feel safe, like I can be myself.",
    "I like you kasi funny ka in your own way. Even yung corny mong jokes, natatawa ako na parang tanga, and I love that.",
    "I like you kasi you inspire me without even trying. When I see you working hard, trying your best kahit pagod ka, parang gusto ko rin galingan.",
    "I like you kasi you listen. Hindi ka yung taong puro salita lang. Kapag nakikinig ka, ramdam ko na you really listen.",
    "I like you kasi you have this calm energy na kapag nandiyan ka, okay lang lahat.",
    "And even when things feel uncertain or you seem distant, I will respect your space and your feelings. That’s how serious I am about you, ja. What I feel for you is not mababaw. It’s not pa-impulsive lang. I’m serious about you, Elijah, and I will always respect you. I’m not here to force you to like me back—I just want you to know na totoo ’to, na hindi ito basta-basta, kasi ikaw ’to eh.",
    "Honestly, ang dami ko pang reasons, ja. If I list everything, kulang yung isang confession lang. Pero pinaka-simpleng reason? Ikaw kasi. My heart chose you. Hindi ko pinlano, hindi ko hinanap. Bigla na lang dumating and then ayun, nagustuhan kita. And hanggang ngayon, ikaw pa rin.",
    "You may not see all these things sa sarili mo, you might even doubt yourself. But I do. I see you, Elijah. I see the good in you na hindi mo nakikita sa sarili mo. And that’s why I like you.",
    "So this is me again, confessing. Pero this time with a twist—hindi lang basta \"I like you.\" Gusto ko alam mo why and why I stayed. And I’ll keep liking you, ja, while respecting whatever you feel."
  ]
};

const scenes = [...document.querySelectorAll("[data-scene]")];
const dots = [...document.querySelectorAll(".progress-dots span")];
const truthCards = [...document.querySelectorAll(".truth-card")];
const unlockButton = document.querySelector(".unlock-button");
const unlockStatus = document.querySelector(".unlock-status");
const soundButton = document.querySelector(".sound-toggle");
let currentScene = "hello";
let soundsOn = false;
let audioContext;

document.querySelectorAll("[data-recipient]").forEach((node) => { node.textContent = LETTER.recipient; });
document.querySelectorAll("[data-sender]").forEach((node) => { node.textContent = LETTER.sender; });

const confessionCopy = document.querySelector("[data-confession-copy]");
LETTER.paragraphs.forEach((text) => {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  confessionCopy.appendChild(paragraph);
});

function playTone(frequency = 440, duration = 0.35) {
  if (!soundsOn) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function setProgress(sceneName) {
  const sceneOrder = { hello: 0, question: 1, pause: 1, truths: 2, letter: 3 };
  dots.forEach((dot, index) => dot.classList.toggle("is-current", index === sceneOrder[sceneName]));
}

function showScene(name) {
  if (name === currentScene) return;
  const outgoing = document.querySelector(`[data-scene="${currentScene}"]`);
  const incoming = document.querySelector(`[data-scene="${name}"]`);
  outgoing.classList.add("is-leaving");

  window.setTimeout(() => {
    outgoing.hidden = true;
    outgoing.classList.remove("is-active", "is-leaving");
    incoming.hidden = false;
    incoming.classList.add("is-active", "is-entering");
    currentScene = name;
    setProgress(name);
    window.scrollTo({ top: 0, behavior: "instant" });
    incoming.querySelector("button")?.focus({ preventScroll: true });
    window.setTimeout(() => incoming.classList.remove("is-entering"), 900);
  }, 380);
  playTone(name === "letter" ? 523.25 : 392);
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showScene(button.dataset.go));
});

truthCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("is-open")) return;
    card.classList.add("is-open");
    card.setAttribute("aria-expanded", "true");
    playTone([392, 440, 523.25][index], 0.45);
    const opened = document.querySelectorAll(".truth-card.is-open").length;
    const remaining = truthCards.length - opened;
    unlockStatus.textContent = remaining
      ? `${remaining} little truth${remaining === 1 ? "" : "s"} left`
      : "The letter is ready for you";
    if (!remaining) {
      unlockButton.disabled = false;
      window.setTimeout(() => unlockButton.focus({ preventScroll: true }), 250);
    }
  });
});

document.querySelector("[data-open-letter]").addEventListener("click", () => {
  const intro = document.querySelector("[data-letter-intro]");
  const confession = document.querySelector("[data-confession]");
  playTone(659.25, 0.7);
  createPetals();
  intro.style.animation = "fadeOut .5s ease both";
  window.setTimeout(() => {
    intro.hidden = true;
    confession.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 480);
});

document.querySelector("[data-restart]").addEventListener("click", () => window.location.reload());
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  if (currentScene !== "hello") showScene("hello");
});

soundButton.addEventListener("click", () => {
  soundsOn = !soundsOn;
  soundButton.setAttribute("aria-pressed", String(soundsOn));
  soundButton.setAttribute("aria-label", `Turn soft sounds ${soundsOn ? "off" : "on"}`);
  if (soundsOn) playTone(523.25, 0.5);
});

function createPetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const container = document.querySelector(".petals");
  for (let index = 0; index < 24; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = index % 3 === 0 ? "♡" : "·";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.opacity = `${0.25 + Math.random() * 0.55}`;
    petal.style.fontSize = `${0.7 + Math.random() * 1.1}rem`;
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    petal.style.animationDuration = `${4 + Math.random() * 4}s`;
    petal.style.animationDelay = `${Math.random() * 1.5}s`;
    container.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}
