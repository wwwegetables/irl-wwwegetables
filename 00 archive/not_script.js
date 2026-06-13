let i = 0;
const messages = ["wwwelcome", "still wwworking on this"];
let msgIndex = 0; 
let charIndex = 0; 
const speed = 120;
const pause = 900;
const el = document.getElementById("msg");

function typeWriter() {
 const current = messages[msgIndex];
 if (charIndex < current.length){
    el.textContent += current.charAt(charIndex);
    charIndex ++;
    setTimeout (typeWriter, speed);}
    else { setTimeout(() => { 
        charIndex = 0; el.textContent = ""; 
        msgIndex = (msgIndex + 1) % messages.length; 
        typeWriter(); }, pause); } }
    

typeWriter();
  