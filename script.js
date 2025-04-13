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

  const totalDays = durations[complexity];
  const issueDate = addBusinessDays(new Date(), 10); // Issue RFP 10 business days from now

  // Proposal Due = 30 calendar days from issue, adjusted to a weekday
  const proposalDue = new Date(issueDate);
  proposalDue.setDate(proposalDue.getDate() + 30);
  nextWeekday(proposalDue);

  const evaluations = addBusinessDays(new Date(proposalDue), 5);
  const negotiations = addBusinessDays(new Date(evaluations), 10);
  const award = addBusinessDays(new Date(negotiations), 10);

  const timelineHTML = `
    <ul class="list-disc list-inside">
      <li><strong>Issue RFP:</strong> ${issueDate.toDateString()}</li>
      <li><strong>Proposal Deadline:</strong> ${proposalDue.toDateString()} <span class="text-xs text-gray-500">(Typically 30-day window)</span></li>
      <li><strong>Evaluations Begin:</strong> ${evaluations.toDateString()}</li>
      <li><strong>Negotiation Window:</strong> ${negotiations.toDateString()}</li>
      <li><strong>Anticipated Award:</strong> ${award.toDateString()}</li>
    </ul>
    <p class="mt-2 text-sm text-gray-600">Total Estimated Timeline: ~${totalDays} calendar days</p>
    <p class="mt-1 text-xs text-yellow-700 italic">⚠️ Final timelines are set by Procurement Services and may vary by project.</p>
  `;

  output.innerHTML = timelineHTML;
}

const processSteps = [
  {
    title: "1. Planning & Requisition",
    detail: "Departments must first determine need and funding. For projects over $10,000, initiate a requisition in RealSource. RFPs are typically used for purchases exceeding $200,000."
  },
  {
    title: "2. Drafting the RFP",
    detail: "Use the official RFP template and tailor the Statement of Needs and evaluation criteria. Contact Procurement if assistance is needed during drafting."
  },
  {
    title: "3. Public Posting",
    detail: "VCU Procurement posts RFPs on eVA. The RFP must remain posted for a minimum period before responses are due."
  },
  {
    title: "4. Evaluator Selection & COI",
    detail: "Evaluation committee members are selected based on expertise and must review and acknowledge the COI policy. The buyer manages the communication protocol."
  },
  {
    title: "5. Proposal Review & Scoring",
    detail: "Evaluators review and score proposals independently based on the published criteria. Committee discussions may follow to determine a shortlist."
  },
  {
    title: "6. Negotiations & Award",
    detail: "Procurement negotiates with top-ranked vendors. Final selection is made, and Procurement finalizes the award and agreement."
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
