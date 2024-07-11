document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("search-input").value;
    if (!query) return;

    chrome.runtime.sendMessage({ type: "search", query }, (response) => {
      if (response.images) {
        displayImages(response.images);
      }
    });
  });

function displayImages(images) {
  const container = document.getElementById("images-container");
  container.innerHTML = "";
  images.forEach((image) => {
    const imgElement = document.createElement("div");
    imgElement.className = "image-item";
    imgElement.innerHTML = `<img src="${image.src}" alt="Image">`;
    container.appendChild(imgElement);
  });
}
