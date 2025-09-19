const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messages = document.getElementById("messages");
const settingsIcon = document.getElementById("settings-icon");
const settingsPanel = document.getElementById("settings-panel");
const responseLength = document.getElementById("response-length");


settingsIcon.onclick = () => {
  settingsPanel.classList.toggle("hidden");
};


async function sendMessage(extraMode = null) {
  const question = userInput.value.trim();
  if (!question && !extraMode) return;

  const userText = extraMode || question;
  if (!extraMode) messages.innerHTML += `<div><b>You:</b> ${question}</div>`;
  userInput.value = "";

  try {
    const res = await fetch("http://127.0.0.1:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: userText,
        length: responseLength.value
      }),
    });

    const data = await res.json();
    const answerText = data.answer || "No response";


    const answerDiv = document.createElement("div");
    answerDiv.innerHTML = `<b>AI:</b> ${answerText}`;

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "response-options";
    ["Examples", "Point-wise", "Detailed"].forEach(mode => {
      const btn = document.createElement("button");
      btn.innerText = mode;
      btn.onclick = () => sendMessage(`${userText} (Provide ${mode} explanation)`);
      optionsDiv.appendChild(btn);
    });

    answerDiv.appendChild(optionsDiv);
    messages.appendChild(answerDiv);

  } catch (err) {
    messages.innerHTML += `<div style="color:red;"><b>Error:</b> Could not reach AI</div>`;
  }

  messages.scrollTop = messages.scrollHeight;
}

sendBtn.onclick = () => sendMessage();
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
