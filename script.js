function updateField(id, value) {
    document.getElementById(id).innerText = value.trim();
}

function updateRow(rowId, spanId, value) {
    const row = document.getElementById(rowId);
    const span = document.getElementById(spanId);
    span.innerText = value.trim();
    row.style.display = value.trim() === "" ? "none" : "block";
}

function updateTime() {
    const h = hours.value;
    const m = minutes.value;
    const row = document.getElementById("row-time");
    const display = document.getElementById("timeDisplay");

    if (!h && !m) {
        row.style.display = "none";
        return;
    }

    let text = "";
    if (h) text += h + " Hour" + (h > 1 ? "s " : " ");
    if (m) text += m + " Minute" + (m > 1 ? "s" : "");

    display.innerText = text.trim();
    row.style.display = "block";
}

function loadLogo(event) {
    const reader = new FileReader();
    reader.onload = function() {
        logoPreview.src = reader.result;
        logoPreview.style.display = "block";
    };
    reader.readAsDataURL(event.target.files[0]);
}

/* Subject */
function handleSubjectChange() {
    const value = subjectSelect.value;
    if (value === "Other") {
        customSubject.style.display = "block";
    } else {
        customSubject.style.display = "none";
        updateRow('row-subject','subject',value);
    }
}

/* Roman */
function toRoman(num) {
    const r = [["M",1000],["CM",900],["D",500],["CD",400],
               ["C",100],["XC",90],["L",50],["XL",40],
               ["X",10],["IX",9],["V",5],["IV",4],["I",1]];
    let s = "";
    for (let [l,v] of r) while(num>=v){s+=l;num-=v;}
    return s;
}

let sectionCount = 0;

function getQuestionTypes(subject) {
    const common = ["Short Answer","Long Answer","Fill in the blanks","MCQ","Match the Following"];

    if (subject === "Mathematics")
        return ["Solve the following","Word Problems",...common];

    if (subject === "Science" || subject === "Biology")
        return ["Define","Give Reasons","Draw Diagram",...common];

    return common;
}

function addSection() {

    sectionCount++;
    const container = document.getElementById("questions-container");
    const roman = toRoman(sectionCount);
    const subject = subjectSelect.value;

    const types = getQuestionTypes(subject);
    const options = types.map(t => `<option>${t}</option>`).join("");

    const section = document.createElement("div");

    section.innerHTML = `
        <div class="section-title">
            <div>${roman}. 
                <select class="section-type">${options}</select>
            </div>
            <div>
                <input type="number" class="numQ" style="width:60px;"> *
                <input type="number" class="marksQ" style="width:60px;"> =
                <span class="totalMarks">0</span> Marks
            </div>
            <button onclick="removeSection(this)">Remove Section</button>
        </div>
        <div class="questions"></div>
        <button onclick="addQuestion(this)">Add Question</button>
    `;

    container.appendChild(section);

    const numInput = section.querySelector(".numQ");
    const marksInput = section.querySelector(".marksQ");
    const totalSpan = section.querySelector(".totalMarks");

    function calc() {
        totalSpan.innerText = (numInput.value && marksInput.value)
            ? numInput.value * marksInput.value
            : 0;
    }

    numInput.oninput = calc;
    marksInput.oninput = calc;
}

function removeSection(btn) {
    btn.closest("div").parentElement.remove();
}

function addQuestion(btn) {

    const section = btn.parentElement;
    const qContainer = section.querySelector(".questions");
    const number = qContainer.children.length + 1;

    const type = section.querySelector(".section-type").value;

    const div = document.createElement("div");
    div.className = "question-item";

    div.innerHTML = `
        ${number}. 
        <input type="text" style="width:70%;">
        <button onclick="removeQuestion(this)">Remove</button>
        <button onclick="addSubPart(this)">Add Sub Part</button>
        <div class="subparts ${type==='MCQ' || type==='Match the Following' ? 'two-column':''}"></div>
    `;

    qContainer.appendChild(div);
}

function removeQuestion(btn){
    btn.parentElement.remove();
}

function addSubPart(btn) {

    const q = btn.parentElement;
    const sub = q.querySelector(".subparts");
    const count = sub.children.length;
    const letter = String.fromCharCode(97 + count);

    const div = document.createElement("div");
    div.className = "subpart";

    div.innerHTML = `
        (${letter}) 
        <input type="text" style="width:75%;">
        <button onclick="this.parentElement.remove()">X</button>
    `;

    sub.appendChild(div);
}

/* PDF */
function downloadPDF() {
    html2pdf().from(document.getElementById("paper")).save("question-paper.pdf");
}

function printPaper() {
    window.print();
}
