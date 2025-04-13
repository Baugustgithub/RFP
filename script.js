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

function countBusinessDays(start, end) {
  let count = 0;
  const date = new Date(start);
  while (date <= end) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
    date.setDate(date.getDate() + 1);
  }
  return count;
}

function generateTimeline() {
  const complexity = document.getElementById('complexity').value;
  const tcv = document.getElementById('tcv').value;
  const output = document.getElementById('timelineOutput');

  if (!complexity) {
    output.innerHTML = "<p class='text-red-600'>Please select a project complexity.</p>";
    return;
  }

  let complexityOffset = 0;
  if (complexity === "medium") complexityOffset = 1;
  if (complexity === "high") complexityOffset = 2;

  const steps = [
    { label: "Planning with Procurement", offset: 3, type: "business" },
    { label: "Initial RFP Draft Due to Procurement", offset: 3, type: "business" },
    { label: "Procurement Review and Edit", offset: 6, type: "business" },
    { label: "Final Draft to Procurement for Posting", offset: 3, type: "business" },
    { label: "RFP Issued via eVA", offset: 1, type: "business" },
    { label: "Firm Questions Due", offset: 10, type: "business" },
    { label: "Addendum/Answers Issued", offset: 4, type: "business" },
    { label: "Proposals Due", offset: 15, type: "business" },
    { label: "Proposals Screened and Shared with Evaluators", offset: 1, type: "business" },
    { label: "Evaluations Begin", offset: 1, type: "business" },
    { label: "Evaluation Period", offset: 7, type: "business" },
    { label: "Oral Presentations (if used)", offset: 5, type: "business" },
    { label: "Negotiation Period", offset: 7, type: "business" },
    { label: "Award Justification & Contract Finalization", offset: 12, type: "business" },
    { label: "Anticipated Award", offset: 1, type: "business" }
  ];

  const fixedAwardDate = new Date("2025-07-02");
  const base = addBusinessDays(new Date(), 2);
  let timeline = [];
  let baseDate = new Date(base);

  steps.forEach((step) => {
    let date;

    if (step.type === "fixed" && step.label === "Award Justification & Contract Finalization") {
      date = new Date(fixedAwardDate);
    } else if (step.type === "business") {
      date = addBusinessDays(baseDate, step.offset + complexityOffset);
    } else {
      date = new Date(baseDate);
      date.setDate(date.getDate() + step.offset + complexityOffset);
      date = nextWeekday(date);
    }

    timeline.push({ label: step.label, date: date.toDateString() });
    baseDate = new Date(date);

    if (step.label === "Award Justification & Contract Finalization") {
      if (tcv === "2m") baseDate.setDate(baseDate.getDate() + 10);
      if (tcv === "5m") baseDate.setDate(baseDate.getDate() + 30);
    }
  });

  // ✅ Accurate date duration after timeline is fully generated
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

// PDF & COI functions remain unchanged...
