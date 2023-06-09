let questionNumber = 1;
let title = '';
let userName = '';
// Get the navigation element
const nav = document.querySelector('nav');

// Variables to keep track of scroll position and timeout
let lastScrollPos = 0;
let scrollingTimeout = null;
let conversationHistory = [{
    role: "system",
    content: 'You work at a a mobile development company called Appsketiers and are a senior mobile app consultant who helps new clients who know nothing about apps explain \
      their idea and layout all of the features and functionality they want so that the company can begin making their UIUX and develop the clients app. The company will use your final list as the agreement between us and the client throughout their app creation. \
      Ask and clarify questions on the clients responses until you understand the clients app idea, goal, app features, and app flows well enough then you will create and respond to the user with the detailed product requirement document that will be used as a reference throughout the development of the clients app. This will contain the following 4 items: \
  1) All of the features and functionality that will exist in the application \
  2) All of the screens that will be needed for the entire application. This includes the screens that might not be directly tied to the features list(For example: settings screen, Password reset screen, or notifications). \
  3) The Features/Functionality will exist on each of the screens \
  4) The details of each screen as well as functionality(For example: The user can perform the functionality of logging in on the login screen. This screen has a text field for email and password as well as a button to login. To login, the user must fill in the email and password field) \
  \
Here are some additional rules for your role as senior mobile app consultant at Appsketiers. You are allowed to make suggestions to the client, but you always confirm if your suggestion is good or not. Confirm you understanding of what they want before you proceed. Assume the client does not know what screens are needed for the app as this is our job at Appsketiers. You will provide them this information based on your understand of what their goal and functionality list is. \
Format your questions so that they are in a list. You pride yourself in the readability of your questions and responses. When you present your final document make it easily readable. Follow these rules: \
 1) Do not ask the client anything that does not directly pertain to gathering their apps idea and feature list(For example, do not ask about budget or timeframes).\
 2) Do not ask the client any technical questions(For example, where is data being stored)\
 3) When stating features, provide them in a numbered list so that it can be read easily and so that it makes it easy for you to understand which point the client is responding to. If the \
client does not specify the exact number line they are responding to and you are unsure which point they are responding to then you can clarify(For example you might respond like this: To clarify, here are your responses 1. Will users be able to login? Your answer: No) \
 4) Do not ask the client what screens they want in the app. Rather, identify what features and functionality they want in the app so that you can provide the screens that will be needed.'
}];



// Function to handle scroll events
const handleScroll = () => {
  // Clear the previous timeout
  clearTimeout(scrollingTimeout);
  
  // Add a class to show the navigation
  nav.classList.remove('fade');
  
  // Set a timeout to fade the navigation after 1 second of inactivity
  scrollingTimeout = setTimeout(() => {
    nav.classList.add('fade');
  }, 1000);
  
  // Update the last scroll position
  lastScrollPos = window.scrollY;
};

// Add scroll event listener to the window
window.addEventListener('scroll', handleScroll);


function convertToBullets(response) {
    const lines = response.split('\n');
    title = lines[0];

    let bulletPoints = '';

    for (let i = 1; i < lines.length; i++) {
        let bulletContent = lines[i];
        let bulletHTML = '';

        if (lines[i].startsWith('-')) {
            bulletContent = lines[i].slice(1);
            bulletHTML = bulletContent;
        } else if (lines[i].endsWith('?')) {
            bulletHTML = bulletContent;
        } else if (lines[i] !== ''){
            bulletHTML = bulletContent;
        }
        else if (lines[i].endsWith(':')){
            bulletHTML = bulletContent;
        }

        bulletPoints += `<li>${bulletHTML}</li>`;
    }

    return `<ul class="bullet-list">${bulletPoints}</ul>`;
}

async function sendMessage() {
    const input = document.getElementById('input');
    const chat = document.getElementById('chat');
    const message = input.value;

    // Add user's message to chat.
    chat.innerHTML += `<div class="message">
                        <img class="profile-picture" src="https://cdn.glitch.global/91ffa88b-6ec0-4f87-b444-e9ce77f764ab/c16.png?v=1685655559113" />
                        <div class="message-wrapper">
                            <div class="user-name">${userName}</div>
                            <div class="message-inner-user">
                                <div class="message-content">
                                    <p><span class="user-question"></span>${message}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;

    // Clear input.
    input.value = '';

    try {
        // Send message to backend and get response.
        const response = await axios.post(`https://maize-puddle-turkey.glitch.me/api/chat`, { prompt: message, history: conversationHistory });

        // Add user message to history.
        conversationHistory.push({role: 'user', content: message});

        // Convert response to bulleted list.
        const formattedResponse = convertToBullets(response.data.reply);

        // Add assistant's response to history.
        conversationHistory.push({role: 'assistant', content: response.data.reply});

        // Add assistant's response to chat.
        chat.innerHTML += `<div class="message gpt">
                                <img class="profile-picture-app" src="https://cdn.glitch.global/91ffa88b-6ec0-4f87-b444-e9ce77f764ab/pose4.png?v=1685655572283" />
                                <div class="message-wrapper">
                                    <div class="user-name">Appy ai</div>
                                    <div class="message-inner">
                                        <div class="message-content">
                                            <p><span class="gpt-question"></span> ${title}</p>${formattedResponse}
                                        </div>
                                    </div>
                                </div>
                            </div>`;

        // Update question number.
        questionNumber++;

        // Scroll chat to bottom.
        chat.scrollTop = chat.scrollHeight;
    } catch (error) {
        console.error(error);
    }
}


window.onload = async function() {
    const chat = document.getElementById('chat');
    // Extract id from URL
     // Extract id from URL
  const id = window.location.pathname.substring(1);

  // Fetch userName using the id
  const response = await axios.get(`https://maize-puddle-turkey.glitch.me/api/username/${id}`);
  
    
  const usernameParts = response.data.userName.split(' - ');
  userName = usernameParts[0];  document.getElementById('user-name').textContent = userName;
  document.getElementById('app-status').textContent = 'Mapping(UI/UX)'; // Update this accordingly
  chat.innerHTML += `<div class="message">
                             <img class="profile-picture-app" src="https://cdn.glitch.global/91ffa88b-6ec0-4f87-b444-e9ce77f764ab/pose4.png?v=1685655572283" />
                            <div class="message-wrapper">
                                 <div class="user-name">Appy ai</div>
                                <div class="message-inner">
                                    <div class="message-content">
                                        <p><span class="gpt-question"></span> En garde! Summarize your app idea below and I will help you lay out the features needed. </p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
  




};
document.getElementById('meeting-button').addEventListener('click', function() {
    var meetingsContainer = document.querySelector('.meetings-iframe-container');
    
    // If the meetings container is hidden, show it. If it's shown, hide it.
    if (meetingsContainer.style.display === 'none') {
        meetingsContainer.style.display = 'block';
    } else {
        meetingsContainer.style.display = 'none';
    }
});

/*document.querySelectorAll(".expand-button").forEach(function(button) {
    button.addEventListener("click", function() {
        const stepId = this.getAttribute("data-step");
        const hiddenItems = document.querySelectorAll(stepId + " .hidden-item");
        const visibleItems = document.querySelectorAll(stepId + " .visible-item");
        
        if (this.textContent === "Show more") {
            hiddenItems.forEach(function(item) {
                item.classList.remove("hidden-item");
                item.classList.add("visible-item");
            });
            this.textContent = "Hide";
        } else {
            visibleItems.forEach(function(item) {
                item.classList.remove("visible-item");
                item.classList.add("hidden-item");
            });
            this.textContent = "Show more";
        }
    });
}); */




