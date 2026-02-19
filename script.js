function updateField(id, value){
    document.getElementById(id).innerText = value;
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

function handleSubjectChange(){
    const v=subjectSelect.value;
    if(v==="Other"){
        customSubject.style.display="block";
    }else{
        customSubject.style.display="none";
        updateRow("row-subject","subject",v);
    }
}

/* Roman */
function toRoman(num){
    const r=[["M",1000],["CM",900],["D",500],["CD",400],
             ["C",100],["XC",90],["L",50],["XL",40],
             ["X",10],["IX",9],["V",5],["IV",4],["I",1]];
    let s="";
    for(let [l,v] of r) while(num>=v){s+=l;num-=v;}
    return s;
}

function toSmallRoman(n){
    return toRoman(n).toLowerCase();
}

let sectionCount=0;

function addSection(){

    sectionCount++;

    const container = document.getElementById("questions-container");
    const roman=toRoman(sectionCount);

    const section=document.createElement("div");
    section.className="section-block";

    section.innerHTML=`
        <div class="section-title">
            <div>${roman}. 
                <select class="section-type">
                    <option>Short Answer</option>
                    <option>MCQ</option>
                    <option>Match the Following</option>
                </select>
            </div>
            <button onclick="this.closest('.section-block').remove()">Remove Section</button>
        </div>
        <div class="questions"></div>
        <button onclick="addQuestion(this)">Add Question</button>
    `;

    container.appendChild(section);
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
            <textarea class="question-text"></textarea>
            <div class="mcq-options">
                (a)<input type="text">
                (b)<input type="text">
                (c)<input type="text">
                (d)<input type="text">
            </div>
            <button onclick="this.parentElement.remove()">Remove</button>
        `;
    }
    else if(type==="Match the Following"){
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
            <textarea class="question-text"></textarea>
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
