function generateTimeline() {
  const project = document.getElementById('projectType').value;
  const complexity = document.getElementById('complexity').value;
  const output = document.getElementById('timelineOutput');

  if (!project || !complexity) {
    output.innerHTML = "<p class='text-red-600'>Please select both project type and complexity.</p>";
    return;
  }

  let duration = complexity === 'low' ? 90 : complexity === 'medium' ? 110 : 130;
  const phases = ["Issue RFP", "Questions Due", "Proposal Deadline", "Evaluations", "Negotiations", "Award"];
  const daysBetween = duration / phases.length;

  const today = new Date();
  const timeline = phases.map((phase, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + Math.round(daysBetween * i));
    return `<li><strong>${phase}:</strong> ${date.toDateString()}</li>`;
  }).join("");

  output.innerHTML = `<ul class="list-disc list-inside">${timeline}</ul>`;
}

const processSteps = [
  { title: "Planning & Requisition", detail: "Define needs and submit requisition in RealSource." },
  { title: "Drafting the RFP", detail: "Use the official VCU RFP template and tailor the scope." },
  { title: "Public Posting", detail: "RFPs are posted on eVA and responses collected via Smartsheet." },
  { title: "Evaluator Selection & COI", detail: "Select committee members and complete COI certifications." },
  { title: "Proposal Review & Scoring", detail: "Use RFP criteria to score proposals individually." },
  { title: "Negotiations & Award", detail: "Shortlist top vendors and negotiate. Finalize award." }
];

window.onload = () => {
  const accordion = document.getElementById('processAccordion');
  processSteps.forEach((step, i) => {
    accordion.innerHTML += `
      <details class="bg-white border rounded p-3">
        <summary class="font-semibold">${i + 1}. ${step.title}</summary>
        <p class="mt-2 text-sm">${step.detail}</p>
      </details>`;
  });

  const checklist = [
    "I understand my role as an evaluator and will score fairly.",
    "I will not discuss proposals outside the evaluation committee.",
    "I have no financial/personal interest in any vendor.",
    "I have not accepted gifts, payments, or favors from vendors.",
    "I will follow all policies under the Virginia Public Procurement Act."
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
    result.innerHTML = "✅ Thank you! You have acknowledged all COI and evaluator responsibilities.";
  } else {
    result.innerHTML = "⚠️ Please review and confirm all items to complete acknowledgment.";
  }
}
