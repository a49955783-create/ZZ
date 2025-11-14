//========================
// 1) الانترو
//========================
setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("main").style.display = "block";
}, 1800);

//========================
// 2) إضافة سطر جديد
//========================
function addRow(code = "", status = "", location = "", units = "") {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td><input value="${code}"></td>
        <td>
            <select>
                <option>متاح</option>
                <option>مشغول</option>
                <option>الهلي</option>
                <option>بوليتو</option>
                <option>خارج الخدمة</option>
            </select>
        </td>
        <td><input value="${location}"></td>
        <td><input value="${units}"></td>
        <td><button class="edit">تعديل</button></td>
        <td><button class="partner">إضافة شريك</button></td>
        <td><button class="delete">حذف</button></td>
    `;

    document.getElementById("tableBody").appendChild(tr);

    tr.querySelector(".delete").onclick = () => tr.remove();
    tr.querySelector(".edit").onclick = () => alert("تم تفعيل وضع التعديل");
    tr.querySelector(".partner").onclick = () => alert("إضافة شريك...");
}

document.getElementById("addRow").onclick = () => addRow();

//========================
// 3) OCR بتحسين + توزيع مباشر للكود فقط
//========================
document.getElementById("startOCR").onclick = async () => {
    const file = document.getElementById("ocrImage").files[0];
    if (!file) return alert("الرجاء اختيار صورة");

    document.getElementById("progress-container").style.display = "block";

    const worker = await Tesseract.createWorker("ara+eng", 1, {
        logger: m => {
            if (m.progress) {
                document.getElementById("progress-bar").style.width = (m.progress * 100) + "%";
                document.getElementById("progress-text").innerText = Math.floor(m.progress * 100) + "%";
            }
        }
    });

    const { data } = await worker.recognize(file);
    await worker.terminate();

    let text = data.text;

    // استخراج الأكواد فقط
    const codes = text.match(/\b\d{3,5}\b/g) || [];

    const mode = document.querySelector("input[name='mode']:checked").value;

    if (mode === "replace") {
        document.getElementById("tableBody").innerHTML = "";
    }

    codes.forEach(code => addRow(code, "", "", ""));

    alert("تم توزيع الأكواد مباشرة!");
};

//========================
// 4) النتيجة النهائية
//========================
document.getElementById("showResult").onclick = () => {
    let output = "";

    document.querySelectorAll("#tableBody tr").forEach(row => {
        const tds = row.querySelectorAll("td");
        output += `${tds[0].querySelector("input").value} | ${tds[1].querySelector("select").value} | ${tds[2].querySelector("input").value} | ${tds[3].querySelector("input").value}\n`;
    });

    document.getElementById("finalOutput").value = output;
};

//========================
// 5) الوقت
//========================
document.getElementById("startTime").onclick = () =>
    alert("تم تسجيل وقت بدء الاستلام");

document.getElementById("endTime").onclick = () =>
    alert("تم تسجيل وقت إنهاء الاستلام");
