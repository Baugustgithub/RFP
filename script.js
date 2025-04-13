function generateTimeline() {
  const complexity = document.getElementById('complexity').value;
  const tcv = document.getElementById('tcv').value;
  const output = document.getElementById('timelineOutput');

  if (!complexity) {
    output.innerHTML = "<p class='text-red-600'>Please select a project complexity.</p>";
    return;
  }

  let complexityOffset = 0;
  if (complexity === "medium") complexityOffset = 2;
  if (complexity === "high") complexityOffset = 3;

  const steps = [
    { label: "Submit a Requisition and Discussion", offset: 2, type: "business" },
    { label: "Initial RFP Draft Due to Procurement", offset: 3, type: "business" },
    { label: "Procurement Review and Edit", offset: 5, type: "business" },
    { label: "Final Draft to Procurement for Posting", offset: 3, type: "business" },
    { label: "RFP Issued via eVA", offset: 2, type: "business" },
    { label: "Firm Questions Due", offset: 10, type: "calendar" },
    { label: "Addendum/Answers Issued", offset: 5, type: "calendar" },
    { label: "Proposals Due", offset: 15, type: "calendar" },
    { label: "Proposals Screened and Shared with Evaluators", offset: 4, type: "business" },
    { label: "Evaluations Begin", offset: 1, type: "business" },
    { label: "Evaluation Period", offset: 7, type: "business" },
    { label: "Oral Presentations (if used)", offset: 5, type: "business" },
    { label: "Negotiation Period", offset: 7, type: "business" },
    { label: "Award Justification & Contract Finalization", offset: 10, type: "fixed" },
    { label: "Anticipated Award", offset: 2, type: "calendar" }
  ];

  const excludedSteps = [
    "Submit a Requisition and Discussion",
    "Initial RFP Draft Due to Procurement",
    "Procurement Review and Edit",
    "Final Draft to Procurement for Posting",
    "RFP Issued via eVA",
    "Firm Questions Due",
    "Addendum/Answers Issued",
    "Proposals Due",
    "Proposals Screened and Shared with Evaluators"
  ];

  const fixedAwardDate = new Date("2025-07-02");
  const base = addBusinessDays(new Date(), 2);
  let timeline = [];
  let baseDate = new Date(base);

  steps.forEach((step) => {
    let date;
    const useOffset = excludedSteps.includes(step.label) ? 0 : complexityOffset;

    if (step.type === "fixed" && step.label === "Award Justification & Contract Finalization") {
      date = new Date(fixedAwardDate);
    } else if (step.type === "business") {
      date = addBusinessDays(baseDate, step.offset + useOffset);
    } else {
      date = new Date(baseDate);
      date.setDate(date.getDate() + step.offset + useOffset);
      date = nextWeekday(date);
    }

    timeline.push({ label: step.label, date: date.toDateString() });
    baseDate = new Date(date);

    if (step.label === "Award Justification & Contract Finalization") {
      if (tcv === "2m") baseDate.setDate(baseDate.getDate() + 10);
      if (tcv === "5m") baseDate.setDate(baseDate.getDate() + 30);
    }
  });

  const timelineStart = new Date(timeline[0].date);
  const timelineEnd = new Date(timeline[timeline.length - 1].date);
  const totalDays = Math.round((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24)) + 1;
  const businessDays = countBusinessDays(timelineStart, timelineEnd);

  const tcvNote =
    tcv === "2m"
      ? "⚠️ Contracts over $2M may require higher-level review and can add ~10 calendar days."
      : tcv === "5m"
      ? `⚠️ Contracts over $5M may require Board of Visitors approval, which can add ~30 calendar days. See the <a href="https://bov.vcu.edu/meetings/" target="_blank" class="underline text-blue-600">BOV Meeting Schedule</a>.`
      : "";

  let timelineHTML = `
    <ul class="list-disc list-inside">
      ${timeline.map(t => `<li><strong>${t.label}:</strong> ${t.date}</li>`).join("")}
    </ul>
    <p class="mt-4 text-sm text-gray-700 font-semibold">⏱ Duration: ${totalDays} calendar days (${businessDays} business days)</p>
    ${tcvNote ? `<p class="mt-1 text-sm text-yellow-700">${tcvNote}</p>` : ""}
    <p class="mt-1 text-xs text-yellow-700 italic">⚠️ Timeline estimates are for planning only. Final schedules are confirmed by Procurement Services.</p>
  `;

  output.innerHTML = `<div id="timelinePrintArea">${timelineHTML}</div>`;
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

function reviewCOI() {
  const total = 5;
  let passed = 0;
  for (let i = 0; i < total; i++) {
    if (document.getElementById(`check${i}`).checked) passed++;
  }

  const result = document.getElementById('coiResults');
  if (passed === total) {
    result.innerHTML = `✅ Thank you. You’ve completed the evaluator readiness checklist.<br>This is not your official COI submission. Please submit your RFP request in RealSource. A buyer will coordinate your project and provide the full COI documentation and guidance.`;
  } else {
    result.innerHTML = "⚠️ Please review and confirm all items to continue.";
  }
}

window.onload = () => {
  const accordion = document.getElementById('processAccordion');
  const processSteps = [
    {
      title: "1. Submit a Requisition and Discussion",
      detail: "To initiate the process, first submit a requisition for over $10,000.  Please be sure to include any supporting documentation, and please add a comment indicating the desire or need to being the RFP process.  From there, the department and Procurement can work on aligning goals, defining a schedule, and discussing roles. Procurement helps advise, guide, and manage the process, including committee membership and direct solicitation strategy."
    },
    {
      title: "2. Initial RFP Draft Due to Procurement",
      detail: "The department submits draft information including the statement of needs, background, suggested evaluation criteria, and timeline preferences."
    },
    {
      title: "3. Procurement Review and Edit",
      detail: "Procurement reviews the draft and makes compliance edits, aligns formatting, and prepares the content for public posting."
    },
    {
      title: "4. Final Draft to Procurement for Posting",
      detail: "Once approved, the final version is submitted for posting. Department approvals should be complete at this stage."
    },
    {
      title: "5. RFP Issued via eVA",
      detail: "Procurement posts the RFP on eVA and coordinates vendor responses via Smartsheet. Standard posting is 25–35 days."
    },
    {
      title: "6. Firm Questions Due",
      detail: "Vendors may submit questions by the deadline in the RFP. Procurement manages this deadline."
    },
    {
      title: "7. Addendum/Answers Issued",
      detail: "Procurement collaborates with the department to issue formal answers through eVA/VBO."
    },
    {
      title: "8. Proposals Due",
      detail: "Proposals must be received on time. Late submissions are not considered. Procurement screens for basic compliance."
    },
    {
      title: "9. Proposals Screened and Shared with Evaluators",
      detail: "Proposals are reviewed by Procurement and distributed to evaluators with appropriate redactions if needed."
    },
    {
      title: "10. Evaluations Begin",
      detail: "Scoring sheets are issued, and evaluators review proposals independently based on published criteria."
    },
    {
      title: "11. Evaluation Period",
      detail: "Evaluators submit scores. Procurement may host meetings to review and shortlist top firms."
    },
    {
      title: "12. Oral Presentations (if used)",
      detail: "Selected vendors may be invited to present to the evaluation team. Attendance is coordinated by Procurement."
    },
    {
      title: "13. Negotiation Period",
      detail: "Procurement leads structured negotiations covering scope, price, and key business terms."
    },
    {
      title: "14. Award Justification & Contract Finalization",
      detail: "The evaluation committee drafts a written justification. Procurement finalizes the contract, routes for legal or executive review, and coordinates signatures."
    },
    {
      title: "15. Anticipated Award",
      detail: "The award is publicly posted to eVA. Vendors are notified, and the project may begin following formal execution."
    }
  ];

  processSteps.forEach((step) => {
    accordion.innerHTML += `
      <details class="bg-white border rounded p-3 shadow-sm">
        <summary class="font-semibold cursor-pointer">${step.title}</summary>
        <p class="mt-2 text-sm">${step.detail}</p>
      </details>`;
  });

  const checklist = [
    "I understand my role as an evaluator and will score proposals fairly.",
    "I will not communicate with vendors or disclose proposal contents.",
    "I have no financial/personal interests in any offerors.",
    "I have not accepted gifts, payments, or favors from vendors.",
    "I will comply with state procurement laws and university policy."
  ];

  const coiForm = document.getElementById('coiChecklist');
  checklist.forEach((item, i) => {
    coiForm.innerHTML += `
      <label class="block">
        <input type="checkbox" id="check${i}" class="mr-2"> ${item}
      </label>`;
  });
};
