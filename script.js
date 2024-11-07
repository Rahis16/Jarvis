
// assistantButton.addEventListener('click', ()=>{
//     assistantButton.classList.toggle('deactivate');
// });

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition. Please use Google Chrome or another supported browser.");
}

let assistantButton = document.querySelector('.activate');
let activateAssistant = document.querySelector('.img-box');
let note = document.querySelector('.note');
// let assistantButton = document.querySelector(".chatbot-icon-container");
// let btn2 = document.querySelector(".chatbot-icon-container"); 
let isListening = false; // Track the listening state
let isSpeaking = false;  // Track the speaking state
let debounceTimer;

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.continuous = false;  // Listen for one result at a time
recognition.interimResults = false;  // Avoid partial responses

// Function to speak and control the assistant's state
function speak(text) {
    return new Promise((resolve) => {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.volume = 1;
        text_speak.lang = "en";

        // Stop recognition while speaking
        if (isListening) recognition.stop();
        isSpeaking = true;

        text_speak.onend = () => {
            console.log("Finished speaking.");
            isSpeaking = false;
            resolve(); // Resolve after speaking ends
        };

        window.speechSynthesis.speak(text_speak);
    });
}

// Function to greet based on the time of day
async function wishMe() {
    let day = new Date();
    let hrs = day.getHours();
    let greetingText;

    if (hrs >= 0 && hrs < 12) {
        greetingText = "Good Morning, How can I help you?";
    } else if (hrs >= 12 && hrs < 16) {
        greetingText = "Good Afternoon, How can I help you?";
    } else {
        greetingText = "Good Evening, How can I help you?";
    }

    await speak(greetingText); // Wait for the greeting to finish
}

// Handle speech recognition results
recognition.onresult = async (event) => {
    let transcript = event.results[event.resultIndex][0].transcript.trim();
    console.log(`Heard: ${transcript}`);

    await takeCommand(transcript);

    // Restart recognition after speaking ends
    if (isListening && !isSpeaking) {
        recognition.start();
    }
};

// Restart recognition when it ends
recognition.onend = () => {
    if (isListening && !isSpeaking) {
        console.log("Restarting recognition...");
        recognition.start();
    }
};

// Toggle listening on button click
assistantButton.addEventListener("click", async () => {
    isListening = !isListening; // Toggle listening state

    if (isListening) {
        note.classList.add('hide-note');
        assistantButton.classList.add('deactivate');
        activateAssistant.classList.remove('hide-assistant');
        activateAssistant.classList.add('show-assistant');
        await wishMe();  // Greet and start listening
        recognition.start();
    } else {
        recognition.stop();
        activateAssistant.classList.add('hide-assistant');
        activateAssistant.classList.remove('show-assistant');
        assistantButton.classList.remove('deactivate');
    }
});

// Handle commands with the same stop logic
async function takeCommand(message) {
    const lowerCaseMessage = message.toLowerCase(); // Normalize input for comparison
    console.log(`Heard: ${lowerCaseMessage}`);

    if (lowerCaseMessage.includes('hello')) {
        await speak("Hello, I am jarvis, how can I help you?");
    } else if (lowerCaseMessage.includes('what is your name') || lowerCaseMessage.includes('tumhara name kya hai')) {
        await speak("My name is Jarvis. I am only designed for assistant at Smart Coder Rahis's  smart acad app which is currently in developing phase!");
    } else if (lowerCaseMessage.includes('who made you')) {
        await speak("I am made by SmartCoderRahis for assistance on his website.");
    } else if (lowerCaseMessage.includes('how are you')) {
        await speak("Well I dont have feelings like humans, but yeah I am doing good, What about you?");
    } else if (lowerCaseMessage.includes('what can you do') || lowerCaseMessage.includes('tell me your capability')) {
        await speak("I can assist you in different ways!. Since, I am still on developing phase, I am only for demo in Smart Coder Rahis portfolio. ");
    } else if (lowerCaseMessage.includes('I am also good') || lowerCaseMessage.includes('I am fine')||lowerCaseMessage.includes('I am')||lowerCaseMessage.includes('good')) {
        await speak("Awesome!, peace be upon you forever!, please click on help button to see commands if you havent yet.");
    } else if (lowerCaseMessage.includes('stop') || lowerCaseMessage.includes('quit') || lowerCaseMessage.includes('bye')) {
        await speak("Good bye!, see you again!");
        simulateClick(assistantButton); // Programmatically click the button
        // simulateCloseButtonClick(); 
        assistantButton.classList.remove('deactivate'); 
    } else {
        await speak("Please note, I have limited responses for you, Please click on the help button on top right with question mark icon to get the list of commands.");
    }
}

// Function to programmatically click the button
function simulateClick(element) {
    const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
    setTimeout(() => {
        element.dispatchEvent(event); // Trigger the click
        console.log("Button clicked programmatically.");
    }, 500);
}

// // Function to programmatically click the close button
// function simulateCloseButtonClick() {
//     const closeButton = document.querySelector(".close-btn");
//     if (closeButton) {
//         const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
//         closeButton.dispatchEvent(event); // Trigger the close button click
//         console.log("Close button clicked programmatically.");
//     }
// }

// function pageSwitcher(pageUrl) {
//     const currentPageUrl = window.location.href.split('/').pop(); // Get only the last part of the URL

//     if (currentPageUrl === pageUrl) {
//         speak("You are already on this page.").then(() => {
//             if (isListening && !isSpeaking) recognition.start(); // Restart listening
//         });
//     } else {
//         const pageName = pageUrl.split('.html')[0]; // Get the page name
//         speak(`Opening ${pageName} page.`).then(() => {
//             window.location.href = pageUrl; // Redirect to the new page
//         });
//     }
// }

recognition.onend = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (isListening && !isSpeaking) recognition.start(); // Restart recognition after a delay
    }, 500);
};

// Button event listeners for both mobile and desktop
// btn2.addEventListener("touchstart", toggleListening);
// btn2.addEventListener("click", toggleListening);

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && isListening && !isSpeaking) {
        recognition.start(); // Restart when the page regains focus
    }
});

let helpBtn = document.getElementById('help-btn');
let menu = document.querySelector('.menu');

helpBtn.addEventListener('click', ()=>{
    menu.classList.toggle('show-menu');
});