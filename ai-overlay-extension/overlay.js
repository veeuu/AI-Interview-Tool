(function () {
  if (document.getElementById("ai-overlay")) return; 

  const overlay = document.createElement("div");
  overlay.id = "ai-overlay";

  const header = document.createElement("h3");
  header.className = "header";
  header.innerText = "AI Assistant";
  overlay.appendChild(header);


  const messages = document.createElement("div");
  messages.id = "messages";
  overlay.appendChild(messages);


  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";

  const userInput = document.createElement("input");
  userInput.id = "user-input";
  userInput.placeholder = "Ask me...";

  const sendBtn = document.createElement("button");
  sendBtn.id = "send-btn";
  sendBtn.innerText = "Send";

  inputContainer.appendChild(userInput);
  inputContainer.appendChild(sendBtn);
  overlay.appendChild(inputContainer);

  document.body.appendChild(overlay);


  let isDragging = false;
  let offsetX, offsetY;

  header.style.cursor = "move";
  header.onmousedown = function(e) {
    isDragging = true;
    offsetX = e.clientX - overlay.getBoundingClientRect().left;
    offsetY = e.clientY - overlay.getBoundingClientRect().top;
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
  };

  function onMouseMove(e) {
    if (!isDragging) return;
    overlay.style.left = e.clientX - offsetX + "px";
    overlay.style.top = e.clientY - offsetY + "px";
    overlay.style.bottom = "auto"; 
    overlay.style.right = "auto"; 
  }

  function onMouseUp() {
    isDragging = false;
    document.onmousemove = null;
    document.onmouseup = null;
  }


  async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    messages.innerHTML += `<div><b>You:</b> ${question}</div>`;
    userInput.value = "";

    try {
      const res = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      messages.innerHTML += `<div><b>AI:</b> ${data.answer || "No response"}</div>`;
    } catch (err) {
      messages.innerHTML += `<div style="color:red;"><b>Error:</b> Could not reach AI</div>`;
    }

    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
