document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("search-input").value;
    if (!query) return;

    const response = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const images = await response.json();
    displayImages(images);
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
