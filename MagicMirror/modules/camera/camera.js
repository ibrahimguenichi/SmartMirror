Module.register("camera", {

  defaults: {},

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ["camera.css"]
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    Log.info("Starting module: " + this.name)
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
    this.initCamera(video);
    return wrapper;
  },

   initCamera(videoElement) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error("Camera access error:", err);
      });
  }
})
