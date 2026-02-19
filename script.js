document.addEventListener("DOMContentLoaded", loadSavedList);

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

    if (!h && !m) {
        row.style.display = "none";
        return;
    }

    let t = "";
    if (h) t += h + " Hour" + (h > 1 ? "s " : " ");
    if (m) t += m + " Minute" + (m > 1 ? "s" : "");

    display.innerText = t.trim();
    row.style.display = "block";
}

function loadLogo(event) {
    const reader = new FileReader();
    reader.onload = function(){
        document.getElementById('logoPreview').src = reader.result;
        document.getElementById('logoPreview').style.display = "block";
    }
    reader.readAsDataURL(event.target.files[0]);
}

/* PDF */
function downloadPDF() {

    const element = document.getElementById("paper");

    const opt = {
        margin: 10,
        filename: 'question-paper.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .catch(err => alert("PDF Error: " + err));
}


function printPaper() {
    window.print();
}

/* ===== TEMPLATE SAVE SYSTEM ===== */

function saveTemplate() {

    const name = prompt("Enter Template Name:");
    if (!name) return;

    const data = {
        school: schoolInput.value,
        sub: subInput.value,
        exam: examInput.value,
        subject: subjectInput.value,
        class: classInput.value,
        student: studentInput.value,
        roll: rollInput.value,
        marks: marksInput.value,
        hours: hours.value,
        minutes: minutes.value
    };

    localStorage.setItem("template_" + name, JSON.stringify(data));
    loadSavedList();
}

function loadSavedList() {
    const select = document.getElementById("savedTemplates");
    select.innerHTML = '<option value="">-- Select Saved --</option>';

    for (let key in localStorage) {
        if (key.startsWith("template_")) {
            const name = key.replace("template_", "");
            select.innerHTML += `<option value="${name}">${name}</option>`;
        }
    }
}

function loadTemplate() {
    const name = savedTemplates.value;
    if (!name) return;

    const data = JSON.parse(localStorage.getItem("template_" + name));

    schoolInput.value = data.school;
    subInput.value = data.sub;
    examInput.value = data.exam;
    subjectInput.value = data.subject;
    classInput.value = data.class;
    studentInput.value = data.student;
    rollInput.value = data.roll;
    marksInput.value = data.marks;
    hours.value = data.hours;
    minutes.value = data.minutes;

    schoolInput.oninput();
    subInput.oninput();
    examInput.oninput();
    subjectInput.oninput();
    classInput.oninput();
    studentInput.oninput();
    rollInput.oninput();
    marksInput.oninput();
    updateTime();
}

function deleteTemplate() {
    const name = savedTemplates.value;
    if (!name) return;

    localStorage.removeItem("template_" + name);
    loadSavedList();
}
