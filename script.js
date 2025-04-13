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

  const start = addBusinessDays(new Date(), 0);
  const steps = [
    { name: "Planning call with Procurement", offset: 0, type: "business" },
    { name: "Initial RFP draft due to Procurement", offset: 2, type: "business" },
    { name: "Procurement review and edit", offset: 5, type: "business" },
    { name: "Final draft to Procurement for posting", offset: 3, type: "business" },
    { name: "RFP issued via eVA (Smartsheet)", offset: 2, type: "business" },
    { name: "Vendor questions due", offset: 10, type: "calendar" },
    { name: "Addendum/answers issued", offset: 4, type: "calendar" },
    { name: "Proposals due", offset: 15, type: "calendar" },
    { name: "Redacted proposals shared with evaluators", offset: 1, type: "business" },
    { name: "Evaluations begin", offset: 1, type: "business" },
    { name: "Evaluation period", offset: 7, type: "business" },
    { name: "Oral presentations (if used)", offset: 2, type: "business" },
    { name: "Negotiation period", offset: 5, type: "business" },
    { name: "Anticipated award posted", offset: 3, type: "business" }
  ];

  let timeline = [];
  let baseDate = new Date(start);

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
    <ul class="list-disc list-inside">
      ${timeline.map(t => `<li><strong>${t.label}:</strong> ${t.date}</li>`).join("")}
    </ul>
    <p class="mt-2 text-sm text-gray-600">Estimated Total Duration: ~${durations[complexity]} calendar days</p>
    <p class="mt-1 text-xs text-yellow-700 italic">⚠️ Timeline estimates based on standard RFP flows. Actual dates are confirmed by Procurement Services.</p>
  `;
}

// --- Full Process Explorer with official descriptions ---
const processSteps = [
  {
    title: "1. Planning Call with Procurement",
    detail: "An initial meeting is scheduled between the department and Procurement to align on goals, timeline, and roles. This ensures early coordination and sets expectations."
  },
  {
    title: "2. Initial RFP Draft Due to Procurement",
    detail: "The department submits the first version of the RFP. This includes the statement of needs, background, evaluation criteria, and timeline preferences."
  },
  {
    title: "3. Procurement Review and Edit",
    detail: "Procurement reviews the draft to ensure compliance with the Virginia Public Procurement Act and university policies. Edits are made as needed."
  },
  {
    title: "4. Final Draft to Procurement for Posting",
    detail: "After review, the final RFP is submitted to Procurement for public posting. All required approvals and internal sign-offs should be complete at this stage."
  },
  {
    title: "5. RFP Issued via eVA (Smartsheet)",
    detail: "Procurement posts the RFP on eVA and coordinates responses via Smartsheet. The public posting period typically ranges from 25–35 days."
  },
  {
    title: "6. Vendor Questions Due",
    detail: "Vendors are given an opportunity to submit written questions. The due date must be clearly stated in the RFP timeline."
  },
  {
    title: "7. Addendum/Answers Issued",
    detail: "Procurement works with the department to draft official responses and posts them via Smartsheet as an addendum to the RFP."
  },
  {
    title: "8. Proposals Due",
    detail: "All proposals must be received by the deadline. Late submissions will not be accepted. Procurement checks compliance before forwarding to evaluators."
  },
  {
    title: "9. Redacted Proposals Shared with Evaluators",
    detail: "Procurement redacts proposals (if needed) to remove pricing or other sensitive data before distributing them to the evaluation team."
  },
  {
    title: "10. Evaluations Begin",
    detail: "Evaluators receive their scoring sheets and begin reviewing proposals independently based on the published evaluation criteria."
  },
  {
    title: "11. Evaluation Period",
    detail: "Evaluators complete their scoring. Procurement may schedule a group review meeting to compile scores and shortlist top offers."
  },
  {
    title: "12. Oral Presentations (if used)",
    detail: "If specified in the RFP, top vendors may be invited to present. This helps clarify solutions and adds depth to evaluations."
  },
  {
    title: "13. Negotiation Period",
    detail: "Procurement leads negotiations with the top-ranked vendor(s). This may include scope clarification, pricing, or terms refinement."
  },
  {
    title: "14. Anticipated Award Posted",
    detail: "Once final evaluations and negotiations are complete, an award notice is posted on eVA and the selected vendor is notified."
  }
];

window.onload = () => {
  const accordion = document.getElementById('processAccordion');
  processSteps.forEach((step) => {
    accordion.innerHTML += `
      <details class="bg-white border rounded p-3">
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
