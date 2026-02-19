let sectionCount = 0;

/* Basic */
function updateText(id,value){
document.getElementById(id).innerText = value;
}

/* Roman */
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

/* Description */
function getDescription(type){
const map={
VeryShort:"Answer in one or two sentences.",
Short:"Answer the following questions.",
Long:"Answer the following questions in detail.",
MCQ:"Choose the correct answer from the options given below.",
Match:"Match the following correctly.",
Fill:"Fill in the blanks with suitable answers.",
TF:"State whether the statements are True or False.",
OneWord:"Answer in one word."
};
return map[type];
}

/* Add Section */
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
<option value="VeryShort">Very Short Answer</option>
<option value="Short">Short Answer</option>
<option value="Long">Long Answer</option>
<option value="MCQ">MCQ</option>
<option value="Match">Match the Following</option>
<option value="Fill">Fill in the Blanks</option>
<option value="TF">True / False</option>
<option value="OneWord">One Word Answer</option>
</select>

<div class="section-description">
${getDescription("VeryShort")}
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

/* Marks calculation */
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

/* Update description */
function updateDescription(select){
const type=select.value;
const desc=select.parentElement.querySelector(".section-description");
desc.innerText=getDescription(type);
}

/* Add Question */
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

/* Match pairs */
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

/* Print */
function printPaper(){
window.print();
}
