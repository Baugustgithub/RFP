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
  if (day === 6) date.setDate(date.getDate() + 2); // Saturday -> Monday
  if (day === 0) date.setDate(date.getDate() + 1); // Sunday -> Monday
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

  const base = addBusinessDays(new Date(), 10); // Draft RFP Due
  const milestones = [
    { name: "Draft RFP Due to Buyer", offset: 0, type: "business" },
    { name: "Buyer Posts RFP (Issue Date)", offset: 10, type: "business" },
    { name: "Vendor Questions Due", offset: 10, type: "calendar" },
    { name: "Answers/Addenda Posted", offset: 4, type: "calendar" },
    { name: "Proposals Due", offset: 15, type: "calendar" },
    { name: "Evaluations Begin", offset: 2, type: "business" },
    { name: "Evaluation Completion", offset: 5, type: "business" },
    { name: "Negotiation Window", offset: 5, type: "business" },
    { name: "Anticipated Award", offset: 5, type: "business" }
  ];

  const dates = [];
  let prevDate = new Date(base);

  for (let i = 0; i < milestones.length; i++) {
    let date = new Date(prevDate);
    if (milestones[i].type === "business") {
      date = addBusinessDays(date, milestones[i].offset);
    } else {
      date.setDate(date.getDate() + milestones[i].offset);
      date = nextWeekday(date);
    }
    dates.push({ name: milestones[i].name, date: date.toDateString() });
    prevDate = new Date(date);
  }

  const totalDays = durations[complexity];
  output.innerHTML = `
    <ul class="list-disc list-inside">
      ${dates.map(d => `<li><strong>${d.name}:</strong> ${d.date}</li>`).join("")}
    </ul>
    <p class="mt-2 text-sm text-gray-600">Total Estimated Timeline: ~${totalDays} calendar days</p>
    <p class="mt-1 text-xs text-yellow-700 italic">⚠️ This tool mirrors typical RFP schedules but actual timelines are determined by Procurement Services.</p>
  `;
}

// --- Expanded RFP Process Explorer ---
const processSteps = [
  {
    title: "1. Planning & Requisition",
    detail: "Departments must confirm internal funding and submit a requisition in RealSource. Projects over $10,000 require this step. Procurement will assign a buyer once the requisition is received."
  },
  {
    title: "2. Developing the RFP",
    detail: "The department drafts the RFP using VCU’s template, working with their assigned buyer. This includes writing the Statement of Needs, evaluation criteria, and anticipated outcomes."
  },
  {
    title: "3. Internal Review & Posting",
    detail: "The buyer reviews the RFP for completeness and compliance. Once approved, the RFP is posted publicly through Smartsheet to eVA for vendor access."
  },
  {
    title: "4. Vendor Q&A Period",
    detail: "Vendors submit written questions by the due date. The buyer coordinates answers with the department and issues formal addenda back through Smartsheet."
  },
  {
    title: "5. Proposal Submission & Closing",
    detail: "All proposals must be submitted before the listed deadline. Late submissions are not accepted. Buyers ensure all requirements are met before forwarding to evaluators."
  },
  {
    title: "6. Evaluation Preparation",
    detail: "Evaluation committee members are selected and must sign the COI certification. Proposals are redacted if necessary and shared for individual scoring."
  },
  {
    title: "7. Scoring & Discussions",
    detail: "Evaluators independently score proposals. The committee may meet to discuss scores, identify a shortlist, and prepare for oral presentations if used."
  },
  {
    title: "8. Negotiations & Selection",
    detail: "Buyers lead negotiations with top-ranked firms. Final scoring may be adjusted post-negotiation. An award recommendation is compiled by the committee."
  },
  {
    title: "9. Award & Contracting",
    detail: "Award decisions are posted on eVA. The buyer finalizes the contract and coordinates onboarding or transition steps with the awarded vendor."
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
