const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const con = canvas.getContext("2d");
const asciiout = document.getElementById("ascii");
const presets = {normal: "@%#&$MW8B0XKRqpZUdhmvyc*+=~-_;:,. ", simple: "@%#*+=-:. ", block: "█▓▒░ ", minimal: "....    "};
const copyts = document.getElementById("copyts");
const contrast = document.getElementById("contrast");
const contrastval = document.getElementById("contrastval");
const invert = document.getElementById("invert");
const asciicon = document.querySelector(".ascii-con");
let presetsel = document.getElementById("preset");
let img = null;

upload.addEventListener("change", () => {
    const file = upload.files[0];
    if(!file) return;

    const currimg = new Image();
    currimg.src = URL.createObjectURL(file);
    currimg.onload = () => {
        asciicon.style.display = "block";
        img = currimg;
        convertascii();
    };
});

presetsel.addEventListener("change", () => {
    if(img) convertascii()
});

if (copyts){
    copyts.addEventListener("click", () => {
        navigator.clipboard.writeText(asciiout.textContent);
        copyts.textContent = "copied!";
        setTimeout(() => {
            copyts.textContent = "copy";
        }, 1500);
    })
};

contrast.addEventListener("input", () => {
    contrastval.textContent = contrast.value;
    if(img) convertascii();
});

invert.addEventListener("change", () => {
    if(img) convertascii();
});

function convertascii() {
    const chars = presets[presetsel.value];
    const width = 120;
    const scale = img.height/img.width;

    canvas.width = width;
    canvas.height = width*scale*0.5;
    con.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = con.getImageData(0,0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let ascii="";

    for(let i = 0; i < canvas.height; i++){
        for(let j = 0; j < canvas.width; j++){
            const index = (i*canvas.width + j)*4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];

            let brightness = 0.299*r + 0.587*g + 0.114*b;
            const contrastValue = parseInt(contrast.value);
            brightness = (brightness-128)*(contrastValue/100)+128;
            brightness = Math.max(0, Math.min(255, brightness));
            if(invert.checked){
                brightness = 255-brightness;
            }
            const charIndex = Math.floor((brightness/255)*(chars.length-1));
            ascii += chars[charIndex];
        }
        ascii += '\n';
    }
    if (presetsel.value==="minimal"){
        asciiout.style.fontWeight = 900;
    }
    else{
        asciiout.style.fontWeight = 400;
    }
    asciiout.textContent = ascii;
}