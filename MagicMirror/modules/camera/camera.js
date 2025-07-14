Module.register("camera", {
  defaults: {},

  getStyles() {
    return ["camera.css"];
  },

  getScripts() {
    return [this.file("dist/bundle.js")];
  },

  start() {
    Log.info("Starting module: " + this.name);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.id = "camera-wrapper";

    const video = document.createElement("video");
    video.id = "camera-stream";
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    wrapper.appendChild(video);

    const scannerOverlay = document.createElement("div");
    scannerOverlay.id = "scanner-overlay";
    wrapper.appendChild(scannerOverlay);

    const qrContainer = document.createElement("div");
    qrContainer.id = "qr-container";

    const qrMessage = document.createElement("p");
    qrMessage.id = "qr-message";
    qrMessage.textContent = "Too many failed attempts. Scan the QR code to sign up:";
    qrContainer.appendChild(qrMessage);

    const qrCanvas = document.createElement("canvas");
    qrCanvas.id = "qr-canvas";
    qrContainer.appendChild(qrCanvas);

    wrapper.appendChild(qrContainer);

    const reactContainer = document.createElement("div");
    reactContainer.id = "react-microfrontend";
    reactContainer.style.display = 'none';
    wrapper.appendChild(reactContainer);

    // const above = (document.getElementsByClassName("region fullscreen above"))[0];
    // above.appendChild(reactContainer);


    this.initCamera(video);
    return wrapper;
  },

  initCamera(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera access not supported in this browser.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = () => {
          videoElement.play();

          const check = setInterval(() => {
            if (window.initFaceDetection) {
              clearInterval(check);
              Log.info("Face detection function found. Starting...");
              window.initFaceDetection(videoElement);
            } else {
              console.warn("Waiting for face detection bundle to load...");
            }
          }, 500);
        };
      })
      .catch((err) => {
        console.error("Camera access error:", err);
      });
  }
});