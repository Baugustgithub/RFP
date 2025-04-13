function addBusinessDays(date, days) {
  let count = 0;
  while (count < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return date;
}

function nextWeekday(date) {
  const day = date.getDay();
  if (day === 6) date.setDate(date.getDate() + 2);
  if (day === 0) date.setDate(date.getDate() + 1);
  return date;
}

function generateTimeline() {
  const complexity = document.getElementById('complexity').value;
  const tcv = document.getElementById('tcv').value;
  const output = document.getElementById('timelineOutput');

  if (!complexity) {
    output.innerHTML = "<p class='text-red-600'>Please select a project complexity.</p>";
    return;
  }

  const durations = {
    low: 90,
    medium: 110,
    high: 130
  };

  const base = addBusinessDays(new Date(), 2);
  const steps = [
    { name: "Planning with Procurement", offset: 0, type: "business" },
    { name: "Initial RFP Draft Due to Procurement", offset: 2, type: "business" },
    { name: "Procurement Review and Edit", offset: 5, type: "business" },
    { name: "Final Draft to Procurement for Posting", offset: 3, type: "business" },
    { name: "RFP Issued via eVA", offset: 2, type: "business" },
    { name: "Firm Questions Due", offset: 10, type: "calendar" },
    { name: "Addendum/Answers Issued", offset: 4, type: "calendar" },
    { name: "Proposals Due", offset: 15, type: "calendar" },
    { name: "Proposals Screened and Shared with Evaluators", offset: 1, type: "business" },
    { name: "Evaluations Begin", offset: 1, type: "business" },
    { name: "Evaluation Period", offset: 7, type: "business" },
    { name: "Oral Presentations (if used)", offset: 2, type: "business" },
    { name: "Negotiation Period", offset: 5, type: "business" },
    { name: "Award Justification & Contract Finalization", offset: 0, type: "calendar" }, // TCV delay added later
    { name: "Anticipated Award", offset: 1, type: "business" }
  ];

  let tcvDelay = 0;
  let tcvNote = "";

  if (tcv === "2m") {
    tcvDelay = 10;
    tcvNote = "⚠️ Contracts over $2M may require higher-level review and can add ~10 calendar days.";
  } else if (tcv === "5m") {
    tcvDelay = 30;
    tcvNote = `⚠️ Contracts over $5M may require Board of Visitors approval, which can add ~30 calendar days. See the <a href="https://bov.vcu.edu/meetings/" target="_blank" class="underline text-blue-600">BOV Meeting Schedule</a>.`;
  }

  steps[13].offset = tcvDelay;

  let timeline = [];
  let baseDate = new Date(base);

  steps.forEach(step => {
    let date = new Date(baseDate);
    if (step.type === "business") {
      date = addBusinessDays(date, step.offset);
    } else {
      date.setDate(date.getDate() + step.offset);
      date = nextWeekday(date);
    }
    timeline.push({ label: step.name, date: date.toDateString() });
    baseDate = new Date(date);
  });

  output.innerHTML = `
    <div id="timelinePrintArea">
      <ul class="list-disc list-inside">
        ${timeline.map(t => `<li><strong>${t.label}:</strong> ${t.date}</li>`).join("")}
      </ul>
      <p class="mt-2 text-sm text-gray-600">Estimated Total Duration: ~${durations[complexity] + tcvDelay} calendar days</p>
      ${tcvNote ? `<p class="mt-1 text-sm text-yellow-700">${tcvNote}</p>` : ""}
      <p class="mt-1 text-xs text-yellow-700 italic">⚠️ Timeline estimates are for planning only. Final schedules are confirmed by Procurement Services.</p>
    </div>
  `;
}

function downloadPDF() {
  const element = document.getElementById('pageContent');
  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("VCU-RFP-Navigator.pdf");
  });
}
