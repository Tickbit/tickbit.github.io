// define an array for 24 * 21 sprite
var board = new Array(504);
var canvas1 = undefined;
var ctx1 = undefined;
var canvas2 = undefined;
var ctx2 = undefined;

window.onload = function() {

    canvas1 = document.getElementById("editCanvas");
    ctx1 = canvas1.getContext("2d");

    canvas2 = document.getElementById("spriteCanvas");
    ctx2 = canvas2.getContext("2d");

    clearBoard(false);

    canvas1.addEventListener("mousedown", function (event) {
    
        let x = event.offsetX;
        let y = event.offsetY;

        x = parseInt(x / 32);
        y = parseInt(y / 32);


        if (board[x+y*24] == 0) {
            ctx1.fillStyle = "blue";
            ctx1.fillRect(x * 32, y * 32, 32, 32);
            board[x+y*24] = 1;
        } else {
            board[x+y*24] = 0;
            drawBoard();
        }

        drawSprite();
    });


    drawBoard();
    
}

function drawBoard() {
    let counter = 0;

    for (let y = 0; y < canvas1.height; y+=32) {
        counter +=1;
        for (let x = 0; x < canvas1.width; x+=32) {
            if (counter % 2 == 0) ctx1.fillStyle = "#888888"; else ctx1.fillStyle = "#cccccc"; 
            if (board[parseInt(x/32)+parseInt(y/32)*24] == 0) {
                ctx1.fillRect(x, y, 32, 32);
            } else {
                ctx1.fillStyle = "blue";
                ctx1.fillRect(x,y,32,32);
            }
            counter +=1;
        }
    }
}


function drawSprite() {
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 24; x++) {
            if (board[x+y*24] == 1) {
                ctx2.fillStyle = "#cc1199";
                ctx2.fillRect(x * 4, y * 4, 4, 4);
            } else {
                ctx2.fillStyle = "#FFFFFF";
                ctx2.fillRect(x * 4, y * 4, 4, 4);
            }
        }
    }
}

function clearBoard(justLoaded) {

    if (justLoaded==false) document.getElementById("ls").value="";

    for (let i = 0; i < 504; i++) {
        board[i] = 0;
    }
    drawBoard();
    drawSprite();
}

function saveSprite1() {

    let datas = [];
    let data = "10000 data ";
    let byte = 0;
    let counter = 0;
    let char = 0;
    let lineNumber = 10001;

    for (let b = 0; b < 504; b++) {
        if (board[b] == 1) { 
            byte = byte | (Math.pow(2, 7-counter));
        }
        counter += 1;
        if (counter % 8 == 0) {
            if (char != 2) {
                data += byte.toString() + ", ";
            } else {
                data += byte.toString();
                datas.push(data);
                data = lineNumber.toString() + " data ";
                char = -1;
                lineNumber+=1;
            }
            byte = 0;
            counter = 0;
            char+=1;
        }
    }

    let saveSprite = document.getElementById("savesprite");
    
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(datas.join("\n")));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);

}

function saveSprite2() {

    let data = "unsigned char spriteData[63] ={";
    let byte = 0;
    let counter = 0;
    let char = 0;

    for (let b = 0; b < 504; b++) {
        if (board[b] == 1) { 
            byte = byte | (Math.pow(2, 7-counter));
        }
        counter += 1;
        if (counter % 8 == 0) {
            if (char != 62) {
                data += byte.toString() + ", ";
            } else {
                data += byte.toString() + "};";
                char = -1;
            }
            byte = 0;
            counter = 0;
            char+=1;
        }
    }

    let saveSprite = document.getElementById("savesprite");
 
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);
    

}

function saveSprite3() {

    let datas = [];
    let data = ".byte   ";
    let byte = 0;
    let counter = 0;
    let char = 0;

    for (let b = 0; b < 504; b++) {
        if (board[b] == 1) { 
            byte = byte | (Math.pow(2, 7-counter));
        }
        counter += 1;
        if (counter % 8 == 0) {
            // byte as hexadecimal
            data += "$"+("0"+byte.toString(16)).slice(-2);
            datas.push(data);
            
            data = ".byte   ";
            byte = 0;
            counter = 0;
        }
    }

    let saveSprite = document.getElementById("savesprite");
 
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(datas.join("\n")));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);
    

}

// https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file-in-the-browser
function openFile (event) { 

        let input = event.target;        
        let reader = new FileReader();
        let content = "";
        reader.onload = function() {
            content = reader.result;
            clearBoard(true);

            // read sprite data from basic data statements
            if (content.includes("data")) {
                let lines = content.split("\n");
                let line = ""
                let datas = [];
                let data = 0;
                let char = 0;
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i];
                    datas = line.split(" ");
                
                    for (let j = 0; j < datas.slice(-3).length; j++) {
                        data = parseInt(datas.slice(-3)[j]);
                        for (let k = 0; k < 8; k++) {
                            if (data & (Math.pow(2, 7-k))) {
                                board[char] = 1;
                            }
                            char++;
                        }
                    }
                    
                }
                drawBoard();
                drawSprite();
            }
 
            // Read sprite data from C code
            if (content.includes("unsigned char")) {
                let datas = content.split(" ");
                datas = datas.splice(-63);
                let data = 0;
                let char = 0;
                for (let i = 0; i < datas.length; i++) {
                    data = datas[i];
                    data = data.replace("{","");
                    data = data.replace("}","");
                    data = data.replace(",","");
                    data = data.replace("=","");
                    data = data.replace(";","");
                    data = parseInt(data);
                    
                    for (let j = 0; j < 8; j++) {
                        if (data & (Math.pow(2, 7-j))) {
                            board[char] = 1;
                        }
                        char++;
                    }
                }
                drawBoard();
                drawSprite();
            }

            // Read sprite data from assembly code
            if (content.includes(".byte")) {
                let lines = content.split("\n");
                let line = ""
                let datas = [];
                let data = 0;
                let char = 0;
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i];
                    datas = line.split("$");
                    
                    for (let j = 0; j < datas.slice(-1).length; j++) {
                        data = parseInt(datas.slice(-1), 16);
                        for (let k = 0; k < 8; k++) {
                            if (data & (Math.pow(2, 7-k))) {
                                board[char] = 1;
                            }
                            char++;
                        }
                    }
                    
                }
                drawBoard();
                drawSprite();
            }
        };
        reader.readAsText(input.files[0]);
        
    }
