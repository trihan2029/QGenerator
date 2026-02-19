function toRoman(num) {
    const r = [["M",1000],["CM",900],["D",500],["CD",400],
               ["C",100],["XC",90],["L",50],["XL",40],
               ["X",10],["IX",9],["V",5],["IV",4],["I",1]];
    let s = "";
    for (let [l,v] of r) while(num>=v){s+=l;num-=v;}
    return s;
}

function toSmallRoman(num){
    return toRoman(num).toLowerCase();
}

let sectionCount = 0;

function addSection() {

    sectionCount++;
    const roman = toRoman(sectionCount);

    const section = document.createElement("div");

    section.innerHTML = `
        <div class="section-title">
            <div>${roman}.
                <select class="section-type">
                    <option>Short Answer</option>
                    <option>MCQ</option>
                    <option>Match the Following</option>
                </select>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Remove Section</button>
        </div>
        <div class="questions"></div>
        <button onclick="addQuestion(this)">Add Question</button>
    `;

    questions-container.appendChild(section);
}

function addQuestion(btn) {

    const section = btn.parentElement;
    const type = section.querySelector(".section-type").value;
    const qContainer = section.querySelector(".questions");
    const number = qContainer.children.length + 1;

    const div = document.createElement("div");
    div.className = "question-item";

    if(type === "MCQ"){

        div.innerHTML = `
            ${number}.
            <textarea class="question-text"></textarea>
            <input type="file" accept="image/*" onchange="addImage(this)">
            <div class="mcq-options">
                (a) <input type="text">
                (b) <input type="text">
                (c) <input type="text">
                (d) <input type="text">
            </div>
            <button onclick="this.parentElement.remove()">Remove</button>
        `;

    } else if(type === "Match the Following"){

        div.innerHTML = `
            ${number}.
            <div class="match-container">
                <div class="match-column left-match"></div>
                <div class="match-column right-match"></div>
            </div>
            <button onclick="addMatchPair(this)">Add Pair</button>
            <button onclick="this.parentElement.remove()">Remove</button>
        `;

    } else {

        div.innerHTML = `
            ${number}.
            <textarea class="question-text"></textarea>
            <input type="file" accept="image/*" onchange="addImage(this)">
            <button onclick="this.parentElement.remove()">Remove</button>
        `;
    }

    qContainer.appendChild(div);
}

function addMatchPair(btn){

    const question = btn.parentElement;
    const left = question.querySelector(".left-match");
    const right = question.querySelector(".right-match");

    const count = left.children.length + 1;

    const leftDiv = document.createElement("div");
    leftDiv.className = "match-item";
    leftDiv.innerHTML = `${toSmallRoman(count)}. <input type="text">`;

    const rightDiv = document.createElement("div");
    rightDiv.className = "match-item";
    rightDiv.innerHTML = `(${String.fromCharCode(96+count)}) <input type="text">`;

    left.appendChild(leftDiv);
    right.appendChild(rightDiv);
}

function addImage(input){
    const reader = new FileReader();
    reader.onload = function(){
        const img = document.createElement("img");
        img.src = reader.result;
        img.className = "question-image";
        input.parentElement.appendChild(img);
    };
    reader.readAsDataURL(input.files[0]);
}

function downloadPDF(){
    html2pdf().from(document.getElementById("paper")).save("question-paper.pdf");
}

function printPaper(){
    window.print();
}
