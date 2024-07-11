chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "search") {
    const query = message.query;

    fetch("http://localhost:3000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        const images = data.map((img) => ({ src: img.src }));
        sendResponse({ images });
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        sendResponse({ images: [] });
      });

    return true; // Indicates that the response will be sent asynchronously
  }
});
