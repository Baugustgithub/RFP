function addBusinessDays(date, days) {
  let count = 0;
  while (count < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
  }
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
  const milestones = ["Issue RFP", "Questions Due", "Proposal Deadline", "Evaluations", "Negotiations", "Award"];
  const today = new Date();
  const startDate = addBusinessDays(new Date(today), 10); // Issue RFP in 10 business days

  const daysBetween = totalDays / (milestones.length - 1);
  const dates = [startDate];

  for (let i = 1; i < milestones.length; i++) {
    const next = addBusinessDays(new Date(dates[i - 1]), Math.round(daysBetween));
    dates.push(next);
  }

  const timelineHTML = milestones.map((m, i) => {
    return `<li><strong>${m}:</strong> ${dates[i].toDateString()}</li>`;
  }).join("");

  output.innerHTML = `
    <ul class="list-disc list-inside">${timelineHTML}</ul>
    <p class="mt-2 text-sm text-gray-600">Total Estimated Timeline: ~${totalDays} calendar days</p>
  `;
}

// ----- Process Explorer -----
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
    result.innerHTML = `✅ Thank you. You’ve completed the evaluator readiness checklist. 
    <br>This is not your official COI submission. Please submit your RFP request in RealSource. A buyer will coordinate your project and provide the full COI documentation and guidance.`;
  } else {
    result.innerHTML = "⚠️ Please review and confirm all items to continue.";
  }
}
