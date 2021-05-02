const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const soundButton = document.getElementById("sound");
const muteButton = document.getElementById("mute");
const canvasCont = document.getElementById("canvas-container");

let cnt = 0,
  interval,
  flag = false,
  // Position of mouse in volume slider
  x = 0,
  y = 0,
  leftWidth = 0;

const knob = document.getElementById("knob"),
  leftSide = knob.previousElementSibling, // left sibling of knob
  rightSide = knob.nextElementSibling, // right sibling of knob
  totalBar = 100; //assuming total number of bars is 100

//setting initial audio volume
audio.volume = 0.19;

//initially hiding pause and mute button
pauseButton.style.display = "none";
muteButton.style.display = "none";

//creating 100 line bars
const createBars = () => {
  for (let i = 0; i < totalBar; i++) {
    const min = 100, // fixing minimum value to 100
      max = 200, // fixing maximum value to 200
      randomHeight = Math.floor(Math.random() * (max - min + 1)) + min, // creating a random height
      randomMargin = Math.floor(Math.random() * (50 - 0 + 1)) + 0, // creating a random margin
      canvas = document.createElement("canvas"); // creating a new canvas element

    //set the attributes of canvas element
    canvas.setAttribute("width", "5px");
    canvas.setAttribute("height", randomHeight);
    canvas.setAttribute("class", "canvas-element");
    canvas.setAttribute("id", i);
    canvas.style.marginTop = randomMargin + "px";
    canvas.addEventListener("click", changeInput);
    canvasCont.appendChild(canvas);
    if (i === totalBar - 1) {
      canvas.style.float = "none";
    }
  }

  //static_tag creation
  insertStaticTags(15, "#18df22", -10, 80); // "Introduction" Tag
  insertStaticTags(35, "#18da9c", -40, 110); // "one_six" Tag
  insertStaticTags(73, "#18da9c", -80, 150); // unnamed Tag
  insertStaticTags(88, "blue", -10, 80); // "Polite" Tag
  insertStaticTags(90, "#6d3c28", -40, 110); // "Empathy" Tag
  insertStaticTags(92, "#488f19", -80, 150); // "Energy" Tag
};

const insertStaticTags = (id, color, margin, h) => {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  canvas.height = 200; //set height of the canvas element
  canvas.style.marginTop = margin + "px"; // adding margin to the canvas element
  ctx.beginPath();
  ctx.fillStyle = color; // fill the line with color
  ctx.fillRect(1.5, h, 2, -200); // overlap a rectangular over element(canvas) with height(h)
  ctx.arc(2.5, h, 2.5, 0, 10); //circle at the bottom of static_tag line
  ctx.fill();
};

const changeInput = (e) => {
  const target = e.target.id; // extract id of the clicked element
  audio.currentTime = target; // change the start time of audio to current time
  cnt = target; // update the count variable too
  if (flag) {
    audio.play(); // if already paused then only change current time, else play the audio as well
  }

  // check the current time and bar & accordingly set background color
  for (let i = 0; i < totalBar; i++) {
    const bar = document.getElementById(i);
    if (i <= target) {
      bar.style.backgroundColor = "pink";
    } else {
      bar.style.backgroundColor = "rgb(230, 230, 230)";
    }
  }
};

const play = () => {
  // pause the audio
  audio.play();

  // display pause button while audio is playing
  playButton.style.display = "none";
  pauseButton.style.display = "inline";

  // set flag to true whenever play
  flag = true;

  // change the background color of bars in the interval of 0.5s
  interval = setInterval(() => {
    var canvas = document.getElementById(cnt);
    canvas.style.backgroundColor = "pink";
    canvas.style.animation = "background 1s";

    // if audio reached the last bar of the total bars(100) then pause and display play button
    if (cnt === totalBar - 1) {
      pause();
      flag = false;
      pauseButton.style.display = "none";
      playButton.style.display = "inline";
      clearInterval(interval);
    }
    cnt++;
  }, 500);
};

const pause = () => {
  // pause the audio
  audio.pause();

  // display play button while audio is pause
  pauseButton.style.display = "none";
  playButton.style.display = "inline";

  // set flag to false whenever pause
  flag = false;

  //clear interval and set the value to null
  clearInterval(interval);
  interval = null;
};

// Handle the mousedown event that's triggered when user drags the knob
const mouseDownHandler = function (e) {
  // Get the current mouse position
  x = e.clientX;
  y = e.clientY;
  leftWidth = leftSide.getBoundingClientRect().width;

  // Attach the listeners to `document`
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
};

const mouseMoveHandler = function (e) {
  // How far the mouse has been moved
  const dx = e.clientX - x;
  const dy = e.clientY - y;

  const containerWidth = knob.parentNode.getBoundingClientRect().width;
  let newLeftWidth = ((leftWidth + dx) * 100) / containerWidth;
  newLeftWidth = Math.max(newLeftWidth, 0);
  newLeftWidth = Math.min(newLeftWidth, 100);

  leftSide.style.width = `${newLeftWidth}%`;
  audio.volume = newLeftWidth / 100; // updating audio volume
  if (audio.volume === 0) {
    soundButton.style.display = "none";
    muteButton.style.display = "inline";
  } else {
    soundButton.style.display = "inline";
    muteButton.style.display = "none";
  }

  leftSide.style.userSelect = "none";
  leftSide.style.pointerEvents = "none";

  rightSide.style.userSelect = "none";
  rightSide.style.pointerEvents = "none";
};

// Triggered when user drops the knob
const mouseUpHandler = function () {
  leftSide.style.removeProperty("user-select");
  leftSide.style.removeProperty("pointer-events");

  rightSide.style.removeProperty("user-select");
  rightSide.style.removeProperty("pointer-events");

  // Remove the handlers of `mousemove` and `mouseup`
  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
};

// Attach the handlers
knob.addEventListener("mousedown", mouseDownHandler);
playButton.addEventListener("click", play);
pauseButton.addEventListener("click", pause);

window.onload = createBars;
