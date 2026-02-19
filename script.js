/* ================= BASIC FUNCTIONS ================= */

function updateField(id, value){
    document.getElementById(id).innerText = value;
    validateTotalMarks();
}

function updateRow(rowId, spanId, value){
    const row = document.getElementById(rowId);
    const span = document.getElementById(spanId);
    span.innerText = value;
    row.style.display = value ? "block" : "none";
}

function updateTime(){
    const h = hours.value;
    const m = minutes.value;
    const row = document.getElementById("row-time");

    if(!h && !m){
        row.style.display="none";
        return;
    }

    let t="";
    if(h) t+=h+" Hour"+(h>1?"s ":" ");
    if(m) t+=m+" Minute"+(m>1?"s":"");

    timeDisplay.innerText=t.trim();
    row.style.display="block";
}

function loadLogo(event){
    const reader=new FileReader();
    reader.onload=function(){
        logoPreview.src=reader.result;
        logoPreview.style.display="block";
    };
    reader.readAsDataURL(event.target.files[0]);
}

/* ================= ROMAN ================= */

function toRoman(num){
    const r=[["M",1000],["CM",900],["D",500],["CD",400],
             ["C",100],["XC",90],["L",50],["XL",40],
             ["X",10],["IX",9],["V",5],["IV",4],["I",1]];
    let s="";
    for(let [l,v] of r) while(num>=v){s+=l;num-=v;}
    return s;
}

/* ================= SECTION SYSTEM ================= */

let sectionCount=0;

function getSectionDescription(type){

    switch(type){
        case "MCQ":
            return "Choose the correct answer from the options given below.";
        case "Match":
            return "Match the following items correctly.";
        case "Short":
            return "Answer the following questions.";
        default:
            return "Answer the following questions.";
    }
}

function addSection(){

    sectionCount++;
    const container = document.getElementById("questions-container");
    const roman = toRoman(sectionCount);

    const section = document.createElement("div");
    section.className = "section-block";

    section.innerHTML = `
        <div class="section-title">

            <div class="section-left">
                ${roman}.
                <select class="section-type" onchange="updateSectionDescription(this)">
                    <option value="Short">Short Answer</option>
                    <option value="MCQ">MCQ</option>
                    <option value="Match">Match the Following</option>
                </select>

                <div class="section-description">
                    ${getSectionDescription("Short")}
                </div>
            </div>

            <div class="section-marks">
                <input type="number" class="numQ" placeholder="No.Q" style="width:60px;"> ×
                <input type="number" class="marksQ" placeholder="Marks" style="width:60px;">
                = <span class="sectionTotal">0</span> Marks
            </div>

        </div>

        <div class="questions"></div>
        <button onclick="addQuestion(this)">Add Question</button>
    `;

    container.appendChild(section);

    const numInput = section.querySelector(".numQ");
    const marksInput = section.querySelector(".marksQ");
    const totalSpan = section.querySelector(".sectionTotal");

    function calculate(){
        const total = (numInput.value && marksInput.value)
            ? numInput.value * marksInput.value
            : 0;
        totalSpan.innerText = total;
        validateTotalMarks();
    }

    numInput.oninput = calculate;
    marksInput.oninput = calculate;
}


function removeSection(btn){
    btn.closest(".section-block").remove();
    validateTotalMarks();
}

/* ================= QUESTION SYSTEM ================= */

function addQuestion(btn){

    const section=btn.parentElement;
    const qContainer=section.querySelector(".questions");
    const number=qContainer.children.length+1;

    const div=document.createElement("div");
    div.className="question-item";

    div.innerHTML=`
        ${number}.
        <textarea class="question-text"></textarea>
        <button onclick="this.parentElement.remove()">Remove</button>
    `;

    qContainer.appendChild(div);
}

/* ================= VALIDATION ================= */

function validateTotalMarks(){

    const headerTotal = parseInt(document.getElementById("totalMarks").innerText) || 0;

    const sections = document.querySelectorAll(".sectionTotal");

    let calculatedTotal = 0;

    sections.forEach(s => {
        calculatedTotal += parseInt(s.innerText) || 0;
    });

    const message = document.getElementById("validationMessage");

    if(headerTotal !== calculatedTotal){
        message.innerText = 
            "Warning: Total Marks mismatch! Section Total = "
            + calculatedTotal + ", Header Total = " + headerTotal;
    }else{
        message.innerText = "";
    }
}

/* ================= CACHE SYSTEM ================= */

function saveTemplate(){

    const name = document.getElementById("templateName").value;
    if(!name){
        alert("Enter template name");
        return;
    }

    const data = {
        school: schoolName.innerText,
        subject: subject.innerText,
        totalMarks: totalMarks.innerText
    };

    localStorage.setItem("template_"+name, JSON.stringify(data));
    loadSavedTemplates();
}

function loadSavedTemplates(){

    const select = document.getElementById("savedTemplates");
    select.innerHTML='<option value="">-- Load Saved Template --</option>';

    for(let key in localStorage){
        if(key.startsWith("template_")){
            const name = key.replace("template_","");
            select.innerHTML+=`<option value="${name}">${name}</option>`;
        }
    }
}

function loadTemplate(){

    const name = document.getElementById("savedTemplates").value;
    if(!name) return;

    const data = JSON.parse(localStorage.getItem("template_"+name));

    schoolName.innerText = data.school;
    subject.innerText = data.subject;
    totalMarks.innerText = data.totalMarks;
}

/* Initialize cache list */
window.onload = loadSavedTemplates;

/* ================= PDF ================= */

function downloadPDF(){
    html2pdf().from(document.getElementById("paper")).save("question-paper.pdf");
}

function printPaper(){
    window.print();
}

function updateSectionDescription(select){

    const type = select.value;
    const descDiv = select.parentElement.querySelector(".section-description");

    descDiv.innerText = getSectionDescription(type);
}
