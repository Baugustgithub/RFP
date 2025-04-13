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

  const base = addBusinessDays(new Date(), 0);
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
    { name: "Anticipated Award Posted", offset: 3, type: "business" }
  ];

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
      <p class="mt-2 text-sm text-gray-600">Estimated Total Duration: ~${durations[complexity]} calendar days</p>
      <p class="mt-1 text-xs text-yellow-700 italic">⚠️ Timeline estimates are for planning only. Final schedules are confirmed by Procurement Services.</p>
    </div>
  `;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const source = document.getElementById("timelinePrintArea").innerText;
  doc.setFontSize(10);
  doc.text(source, 10, 10);
  doc.save("VCU-RFP-Timeline.pdf");
}

// --- Process Explorer ---
const processSteps = [
  {
    title: "1. Planning with Procurement",
    detail: "An initial meeting is scheduled between the department and Procurement to align on goals, timeline, and roles. Procurement helps advise, guide, and manage the process, including committee membership and direct solicitation strategy."
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
    title: "14. Anticipated Award Posted",
    detail: "Award is announced on eVA. Procurement supports justification memos and initiates contract signature routing."
  }
];

window.onload = () => {
  const accordion = document.getElementById('processAccordion');
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
