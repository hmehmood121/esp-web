/**
 * Generate a thumbnail from a video file
 * @param {File} videoFile - The video file to generate a thumbnail from
 * @param {number} seekTo - Time in seconds to seek to for the thumbnail
 * @returns {Promise<string>} - A data URL of the thumbnail
 */
export async function generateVideoThumbnail(videoFile, seekTo = 1) {
    return new Promise((resolve, reject) => {
      // Create video element
      const videoElement = document.createElement("video")
      videoElement.src = URL.createObjectURL(videoFile)
      videoElement.crossOrigin = "anonymous"
      videoElement.muted = true
      videoElement.currentTime = seekTo
  
      videoElement.addEventListener("loadeddata", () => {
        // Create canvas and draw video frame
        const canvas = document.createElement("canvas")
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight
  
        const ctx = canvas.getContext("2d")
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
  
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
  
        // Clean up
        URL.revokeObjectURL(videoElement.src)
  
        resolve(dataUrl)
      })
  
      videoElement.addEventListener("error", (error) => {
        URL.revokeObjectURL(videoElement.src)
        reject(error)
      })
    })
  }
  