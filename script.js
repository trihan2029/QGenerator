
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
const h = document.getElementById("hours").value;
const m = document.getElementById("minutes").value;
const row = document.getElementById("row-time");
const display = document.getElementById("timeDisplay");
if (!h && !m) { row.style.display = "none"; return; }
let text = "";
if (h) text += h + " Hour" + (h > 1 ? "s " : " ");
if (m) text += m + " Minute" + (m > 1 ? "s" : "");
display.innerText = text.trim();
row.style.display = "block";
}

function loadLogo(event) {
const reader = new FileReader();
reader.onload = function() {
const img = document.getElementById("logoPreview");
img.src = reader.result;
img.style.display = "block";
};
reader.readAsDataURL(event.target.files[0]);
}

let sectionCount = 0;

function toRoman(num){
const r=[["M",1000],["CM",900],["D",500],["CD",400],
["C",100],["XC",90],["L",50],["XL",40],
["X",10],["IX",9],["V",5],["IV",4],["I",1]];
let s="";
for(let [l,v] of r){
while(num>=v){ s+=l; num-=v; }
}
return s;
}

function toSmallRoman(n){
return toRoman(n).toLowerCase();
}

function getDescription(type){
const map={
Short:"Answer the following questions.",
Long:"Answer the following questions in detail.",
MCQ:"Choose the correct answer.",
Match:"Match the following correctly.",
Fill:"Fill in the blanks.",
TF:"State True or False.",
OneWord:"Answer in one word."
};
return map[type];
}

function addSection(){

sectionCount++;
const container=document.getElementById("questions-container");
const roman=toRoman(sectionCount);

const section=document.createElement("div");
section.className="section-block";

section.innerHTML=`
<div class="section-title">

<div class="section-left">
${roman}.
<select class="section-type" onchange="updateDescription(this)">
<option value="Short">Short Answer</option>
<option value="Long">Long Answer</option>
<option value="MCQ">MCQ</option>
<option value="Match">Match the Following</option>
<option value="Fill">Fill in the Blanks</option>
<option value="TF">True / False</option>
<option value="OneWord">One Word Answer</option>
</select>

<div class="section-description">
${getDescription("Short")}
</div>
</div>

<div class="section-marks">
<input type="number" class="numQ" style="width:60px;"> ×
<input type="number" class="marksQ" style="width:60px;">
= <span class="sectionTotal">0</span> Marks
</div>

</div>

<div class="questions"></div>

<button onclick="addQuestion(this)">Add Question</button>
<button onclick="this.closest('.section-block').remove()">Remove Section</button>
`;

container.appendChild(section);

const numInput=section.querySelector(".numQ");
const marksInput=section.querySelector(".marksQ");
const totalSpan=section.querySelector(".sectionTotal");

function calc(){
const total=(numInput.value && marksInput.value)
? numInput.value*marksInput.value : 0;
totalSpan.innerText=total;
}
numInput.oninput=calc;
marksInput.oninput=calc;
}

function updateDescription(select){
const type=select.value;
const desc=select.parentElement.querySelector(".section-description");
desc.innerText=getDescription(type);
}

function addQuestion(btn){

const section=btn.parentElement;
const type=section.querySelector(".section-type").value;
const qContainer=section.querySelector(".questions");
const number=qContainer.children.length+1;

const div=document.createElement("div");
div.className="question-item";

if(type==="MCQ"){
div.innerHTML=`
${number}.
<textarea></textarea>
<div class="mcq-options">
(a)<input type="text">
(b)<input type="text">
(c)<input type="text">
(d)<input type="text">
</div>
<button onclick="this.parentElement.remove()">Remove</button>
`;
}
else if(type==="Match"){
div.innerHTML=`
${number}.
<div class="match-container">
<div class="match-column left"></div>
<div class="match-column right"></div>
</div>
<button onclick="addMatchPair(this)">Add Pair</button>
<button onclick="this.parentElement.remove()">Remove</button>
`;
}
else{
div.innerHTML=`
${number}.
<textarea></textarea>
<button onclick="this.parentElement.remove()">Remove</button>
`;
}

qContainer.appendChild(div);
}

function addMatchPair(btn){

const q=btn.parentElement;
const left=q.querySelector(".left");
const right=q.querySelector(".right");

const count=left.children.length+1;

const l=document.createElement("div");
l.innerHTML=`${toSmallRoman(count)}. <input type="text">`;

const r=document.createElement("div");
r.innerHTML=`(${String.fromCharCode(96+count)}) <input type="text">`;

left.appendChild(l);
right.appendChild(r);
}

function downloadPDF(){
html2pdf().from(document.getElementById("paper")).save("question-paper.pdf");
}

function printPaper(){
window.print();
}
