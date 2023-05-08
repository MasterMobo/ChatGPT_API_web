document.querySelector("#send_message").addEventListener("click", async () => {
    const user_message = document.querySelector("#user_message").value;
    if (!user_message) return;
    
    createNewChatEntry("user", user_message);
    document.querySelector("#user_message").value = "";
    const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "user", content: user_message }),
    });
    const data = await response.json();
    console.log(data);
    createNewChatEntry(data.role, data.content);
});

const createNewChatEntry = (role, content) => {
    const messages = document.querySelector("#messages");
    const chatEntry = document.createElement("div");
    chatEntry.classList.add("chat-entry");
    chatEntry.classList.add(role);
    chatEntry.innerText = content;
    messages.appendChild(chatEntry);
};
