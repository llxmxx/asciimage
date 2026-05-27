const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const con = canvas.getContext("2d");
const asciiout = document.getElementById("ascii");
const chars = "@#W$9876543210?!abc;:+=-_,. ";

upload.addEventListener("change", () => {
    const file = upload.files[0];
    if(!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
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

                const brightness = 0.299*r + 0.587*g + 0.114*b;
                const charIndex = Math.floor((brightness/255)*(chars.length-1));
                ascii += chars[charIndex];
            }
            ascii += '\n';
        }
        asciiout.textContent = ascii;
    };
});