import * as faceapi from "@vladmandic/face-api";
import QRCode from "qrcode";

let snapshotSent = false;
const REQUIRED_FRONTAL_TIME = 3000; // 3 seconds
let paused = false;
let failedLoginCount = 0;
const MAX_FAILED_ATTEMPTS = 3;

async function detectAndSend(video) {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/modules/camera/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/modules/camera/models");

  console.log("✅ FaceAPI models loaded");

  const canvas = document.createElement("canvas");
  const scannerOverlay = document.getElementById("scanner-overlay");
  const qrContainer = document.getElementById("qr-container");
  const qrCanvas = document.getElementById("qr-canvas");
  const complementsContainer = document.getElementById("module_3_compliments");
  const clockModule = document.getElementById("module_2_clock");
  const weatherModule1 = document.getElementById("module_5_weather");
  const weatherModule2 = document.getElementById("module_6_weather");
  const newsFeed = document.getElementById("module_7_newsfeed");

  let frontalStartTime = null;
  let missedFrontalFrames = 0;
  const MAX_MISSED_FRONTAL_FRAMES = 5;

  function startScanAnimation(landmarks) {
    const videoEl = document.getElementById("camera-stream");
    const videoWidth = videoEl.videoWidth;
    const videoHeight = videoEl.videoHeight;
    const displayWidth = videoEl.offsetWidth;
    const displayHeight = videoEl.offsetHeight;

    const xScale = displayWidth / videoWidth;
    const yScale = displayHeight / videoHeight;

    const margin = 20;

    const jaw = landmarks.getJawOutline();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();

    const allPoints = [...jaw, ...leftEye, ...rightEye, ...nose];
    const xs = allPoints.map(pt => pt.x * xScale);
    const ys = allPoints.map(pt => pt.y * yScale);

    let minX = Math.min(...xs) - margin;
    let minY = Math.min(...ys) - margin;
    let maxX = Math.max(...xs) + margin;
    let maxY = Math.max(...ys) + margin;

    const height = maxY - minY;
    const expandY = height * 0.8;

    minY = Math.max(minY - expandY * 0.9, 0);
    maxY = Math.min(maxY + expandY * 0.4, displayHeight);

    const width = maxX - minX;
    const newHeight = maxY - minY;

    const mirroredLeft = displayWidth - (minX + width);

    scannerOverlay.style.display = "block";
    scannerOverlay.style.left = `${mirroredLeft}px`;
    scannerOverlay.style.top = `${minY}px`;
    scannerOverlay.style.width = `${width}px`;
    scannerOverlay.style.height = `${newHeight}px`;

    scannerOverlay.classList.remove("active");
    void scannerOverlay.offsetWidth;
    scannerOverlay.classList.add("active");
  }

  function stopScanAnimation() {
    scannerOverlay.style.display = "none";
    scannerOverlay.classList.remove("active");
  }

  function showQRCode() {
    showReactAppWithoutRed();
    if (!qrContainer || !qrCanvas) {
      console.error("QR container or canvas not found");
      return;
    }

    const signupURL = "dinosaur-pet-ladybird.ngrok-free.app/home/signup"; // Replace with real URL
    complementsContainer.style.display = "none";
    qrContainer.id = "qr-container-displayed";

    QRCode.toCanvas(qrCanvas, signupURL, { width: 310 }, (err) => {
      if (err) console.error("❌ QR generation error:", err);
      else console.log("📱 QR code generated");
    });
  }

  function handleFailedAttempt() {
    failedLoginCount++;
    console.warn(`❌ Failed login attempt ${failedLoginCount}`);

    stopScanAnimation();
    paused = true;

    if (failedLoginCount >= MAX_FAILED_ATTEMPTS) {
      console.warn("🛑 Max login attempts reached. Showing QR code.");
      showQRCode();

      setTimeout(() => {
        resetDetection();
      }, 30000);

      return;
    }

    setTimeout(() => {
      paused = false;
      snapshotSent = false;
      frontalStartTime = null;
      detectLoop();
    }, 2000);
  }

  function resetDetection() {
    console.log("🔄 Resetting detection...");
    failedLoginCount = 0;
    snapshotSent = false;
    paused = false;
    frontalStartTime = null;
    missedFrontalFrames = 0;

    if (qrContainer) {
      qrContainer.id = "qr-container";
      complementsContainer.style.display = "block";
    }
    detectLoop();
  }

  function showReactAppWithoutRed() {
    console.log("📲 Loading React app");

    // Hide MagicMirror modules
    if (complementsContainer) complementsContainer.style.display = "none";
    if (clockModule) clockModule.style.display = "none";
    if (weatherModule1) weatherModule1.style.display = "none";
    if (weatherModule2) weatherModule2.style.display = "none";
    if (newsFeed) newsFeed.style.display = "none";

    const reactContainer = document.getElementById("react-microfrontend");
    if (!reactContainer) {
      console.error("❌ React container not found");
      return;
    }

    // Show the container
    reactContainer.style.display = "block";
    reactContainer.innerHTML = "<div id='react-root'></div>"; // for React to mount inside

    // ✅ Load CSS only once
    if (!document.getElementById("react-css")) {
      const link = document.createElement("link");
      link.id = "react-css";
      link.rel = "stylesheet";
      link.href = "/modules/react-microfrontend/dist/assets/index.css";
      link.onload = () => console.log("✅ React CSS loaded");
      link.onerror = () => console.error("❌ Failed to load React CSS");
      document.head.appendChild(link);
    }

    // ✅ Load React bundle (Vite) only once
    if (!document.getElementById("react-script")) {
      const script = document.createElement("script");
      script.id = "react-script";
      script.type = "module";
      script.src = "/modules/react-microfrontend/dist/bundle.js";
      script.onload = () => console.log("✅ React bundle loaded");
      script.onerror = () => console.error("❌ Failed to load React bundle");
      document.body.appendChild(script);
    }
  }

  function showReactApp() {
    console.log("📲 Loading React app");

    // Hide MagicMirror modules
    if (complementsContainer) complementsContainer.style.display = "none";
    if (clockModule) clockModule.style.display = "none";
    if (weatherModule1) weatherModule1.style.display = "none";
    if (weatherModule2) weatherModule2.style.display = "none";
    if (newsFeed) newsFeed.style.display = "none";

    const reactContainer = document.getElementById("react-microfrontend");
    if (!reactContainer) {
      console.error("❌ React container not found");
      return;
    }

    // Show the container
    reactContainer.style.display = "block";
    reactContainer.innerHTML = "<div id='react-root'></div>"; // for React to mount inside

    // ✅ Set route to /home (SPA-style)
    window.history.pushState({}, "", "/home");

    // ✅ Load CSS only once
    if (!document.getElementById("react-css")) {
      const link = document.createElement("link");
      link.id = "react-css";
      link.rel = "stylesheet";
      link.href = "/modules/react-microfrontend/dist/assets/index.css";
      link.onload = () => console.log("✅ React CSS loaded");
      link.onerror = () => console.error("❌ Failed to load React CSS");
      document.head.appendChild(link);
    }

    // ✅ Load React bundle (Vite) only once
    if (!document.getElementById("react-script")) {
      const script = document.createElement("script");
      script.id = "react-script";
      script.type = "module";
      script.src = "/modules/react-microfrontend/dist/bundle.js";
      script.onload = () => console.log("✅ React bundle loaded");
      script.onerror = () => console.error("❌ Failed to load React bundle");
      document.body.appendChild(script);
    }
  }


  async function detectLoop() {
    if (paused) return;

    const now = Date.now();

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (detection) {
      const { landmarks } = detection;
      const nose = landmarks.getNose()[3];
      const leftEye = landmarks.getLeftEye()[0];
      const rightEye = landmarks.getRightEye()[3];

      const eyeYAligned = Math.abs(leftEye.y - rightEye.y) < 5;
      const noseCenterX = (leftEye.x + rightEye.x) / 2;
      const noseCentered = Math.abs(nose.x - noseCenterX) < 10;

      if (eyeYAligned && noseCentered) {
        console.log("👁️ Frontal face detected");

        if (!frontalStartTime) {
          frontalStartTime = now;
          startScanAnimation(landmarks);
        }

        missedFrontalFrames = 0;
        const frontalDuration = now - frontalStartTime;
        console.log("⏱️ Frontal duration (ms):", frontalDuration);

        if (frontalDuration >= REQUIRED_FRONTAL_TIME && !snapshotSent) {
          stopScanAnimation();
          console.log("✅ Face held steady. Taking snapshot...");
          snapshotSent = true;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob, "face.jpg");

            try {
              const response = await fetch("http://localhost:9090/api/auth/face_login", {
                method: "POST",
                body: formData,
                credentials: "include", // <-- Add this!
              });

              const result = await response.json();
              console.log("🎉 API Response:", result);

              if (response.ok) {
                console.log("✅ Login test success");
                stopScanAnimation();

                window.dispatchEvent(new CustomEvent("userLoginSuccess", {
                  detail: result, // ✅ Now it's a usable object
                }));

                showReactApp();
              } else {
                console.warn("❌ Login failed");
                handleFailedAttempt();
              }
            } catch (err) {
              console.error("❌ Snapshot failed to send:", err);
              resetDetection();
            }
          }, "image/jpeg", 0.95);

          return;
        }
      } else {
        missedFrontalFrames++;
        if (missedFrontalFrames >= MAX_MISSED_FRONTAL_FRAMES) {
          console.log("⚠️ Not frontal anymore. Resetting.");
          frontalStartTime = null;
          missedFrontalFrames = 0;
          stopScanAnimation();
        }
      }
    } else {
      missedFrontalFrames++;
      if (missedFrontalFrames >= MAX_MISSED_FRONTAL_FRAMES) {
        console.log("❌ No face detected. Resetting.");
        frontalStartTime = null;
        missedFrontalFrames = 0;
        stopScanAnimation();
      }
    }

    requestAnimationFrame(detectLoop);
  }

  detectLoop();
  window.resetFaceDetection = resetDetection;
}

window.initFaceDetection = detectAndSend;