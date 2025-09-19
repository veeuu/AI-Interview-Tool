const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messages = document.getElementById("messages");

sendBtn.onclick = async () => {
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
};

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
