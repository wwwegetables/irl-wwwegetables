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

let coll = document.getElementsById("logs");
let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
  