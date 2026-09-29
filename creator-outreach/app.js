const STORAGE_KEY = "flip-creator-outreach-v1";
const SENDER_NAME = "Ayuchen";
const SENDER_ROLE = "Flip (fliptexts.com)";

let creators = [];
let overrides = {};

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    overrides = raw ? JSON.parse(raw) : {};
  } catch (e) {
    overrides = {};
  }
}

function saveOverrides() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    /* storage unavailable; edits stay in-memory for this session */
  }
}

function getRow(handle) {
  const base = creators.find((c) => c.handle === handle);
  const ov = overrides[handle] || {};
  return {
    ...base,
    email: ov.email || "",
    rate: ov.rate || "",
    status: ov.status || "Not contacted",
  };
}

function setOverride(handle, field, value) {
  overrides[handle] = overrides[handle] || {};
  overrides[handle][field] = value;
  saveOverrides();
}

function tierTone(priority) {
  if (priority === "A") {
    return "You're on our short list of creators we'd most like to partner with first.";
  }
  if (priority === "B") {
    return "Your content is exactly the kind of format we think could work really well for a Flip collab.";
  }
  return "We came across your page and think there could be a good fit for a Flip collab.";
}

function buildEmail(row) {
  const subject = `Flip x ${row.handle} — paid collab on ${row.angle.toLowerCase()} content`;
  const caveatLine = row.caveat ? `\n(One thing to flag on our end: ${row.caveat.toLowerCase()}. Happy to talk through whether that changes the fit.)\n` : "";
  const body = `Hi ${row.handle.replace("@", "")},

I'm ${SENDER_NAME}, reaching out from ${SENDER_ROLE}. Flip helps people manage money entirely over iMessage — budgeting, moving money after payday, and staying on top of bills, all through text instead of another dashboard app.

${tierTone(row.priority)} ${row.whyFit}
${caveatLine}
We'd love to set up a paid collaboration — a sponsored video or short series around ${row.angle.toLowerCase()}, styled the way you normally post. Could you share:
1. Your current sponsorship/collab rates (single video + series pricing if you have it)
2. Typical turnaround time
3. Any brand categories you don't work with

Happy to send more on Flip and examples of what we're picturing once we know it could be a fit.

Thanks so much,
${SENDER_NAME}
${SENDER_ROLE}`;
  return { subject, body };
}

function mailtoLink(email, subject, body) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${encodeURIComponent(email)}?${params.toString().replace(/\+/g, "%20")}`;
}

function renderStats(rows) {
  const stats = document.getElementById("stats");
  const total = rows.length;
  const withEmail = rows.filter((r) => getRow(r.handle).email).length;
  const emailed = rows.filter((r) => getRow(r.handle).status !== "Not contacted").length;
  stats.innerHTML = `
    <div><b>${total}</b>in view</div>
    <div><b>${withEmail}</b>have an email</div>
    <div><b>${emailed}</b>contacted</div>
  `;
}

function currentFilters() {
  return {
    priority: document.getElementById("filterPriority").value,
    status: document.getElementById("filterStatus").value,
    search: document.getElementById("search").value.trim().toLowerCase(),
  };
}

function filteredCreators() {
  const f = currentFilters();
  return creators.filter((c) => {
    const row = getRow(c.handle);
    if (f.priority !== "all" && c.priority !== f.priority) return false;
    if (f.status !== "all" && row.status !== f.status) return false;
    if (f.search) {
      const hay = `${c.handle} ${c.angle} ${c.whyFit}`.toLowerCase();
      if (!hay.includes(f.search)) return false;
    }
    return true;
  });
}

function render() {
  const rows = filteredCreators();
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  rows.forEach((c) => {
    const row = getRow(c.handle);
    const tr = document.createElement("tr");
    if (row.status === "Passed") tr.classList.add("passed");

    tr.innerHTML = `
      <td class="col-check"><input type="checkbox" class="row-check" data-handle="${c.handle}" /></td>
      <td class="col-priority"><span class="tier-badge tier-${c.priority}">${c.priority}</span></td>
      <td>
        <span class="handle">${c.handle}</span>
        ${c.caveat ? `<span class="caveat">${c.caveat}</span>` : ""}
      </td>
      <td>${c.angle}</td>
      <td><span class="why-fit">${c.whyFit}</span></td>
      <td class="col-email"><input type="email" placeholder="paste email once found" data-handle="${c.handle}" data-field="email" value="${row.email}" /></td>
      <td class="col-rate"><input type="text" placeholder="e.g. $800/video" data-handle="${c.handle}" data-field="rate" value="${row.rate}" /></td>
      <td class="col-status">
        <select data-handle="${c.handle}" data-field="status">
          ${["Not contacted", "Emailed", "Replied", "Negotiating", "Booked", "Passed"]
            .map((s) => `<option value="${s}" ${row.status === s ? "selected" : ""}>${s}</option>`)
            .join("")}
        </select>
      </td>
      <td class="col-actions"><button class="btn btn-small draft-one" data-handle="${c.handle}">Draft</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input[data-field], select[data-field]").forEach((el) => {
    el.addEventListener("change", (e) => {
      const { handle, field } = e.target.dataset;
      setOverride(handle, field, e.target.value);
      if (field === "status") render();
    });
  });

  tbody.querySelectorAll(".draft-one").forEach((btn) => {
    btn.addEventListener("click", (e) => openDraftModal([e.target.dataset.handle]));
  });

  renderStats(rows);
}

function openDraftModal(handles) {
  const modal = document.getElementById("draftModal");
  const body = document.getElementById("draftModalBody");
  const title = document.getElementById("draftModalTitle");
  title.textContent = handles.length === 1 ? `Draft for ${handles[0]}` : `Drafts for ${handles.length} creators`;
  body.innerHTML = "";

  handles.forEach((handle) => {
    const row = getRow(handle);
    const { subject, body: text } = buildEmail(row);
    const item = document.createElement("div");
    item.className = "draft-item";
    item.innerHTML = `
      <h3>${handle} &mdash; ${row.email ? row.email : '<span class="no-email">no email on file yet</span>'}</h3>
      <input type="text" value="${subject}" data-role="subject" style="width:100%; margin-bottom:8px;" />
      <textarea data-role="body">${text}</textarea>
      <div class="draft-actions">
        <button class="btn btn-small btn-primary open-mail" ${row.email ? "" : "disabled"}>Open in mail app</button>
        <button class="btn btn-small copy-draft">Copy text</button>
        <button class="btn btn-small mark-emailed" data-handle="${handle}">Mark as emailed</button>
      </div>
    `;
    const subjInput = item.querySelector('[data-role="subject"]');
    const bodyInput = item.querySelector('[data-role="body"]');

    item.querySelector(".open-mail").addEventListener("click", () => {
      window.open(mailtoLink(row.email, subjInput.value, bodyInput.value), "_blank");
    });
    item.querySelector(".copy-draft").addEventListener("click", async () => {
      await navigator.clipboard.writeText(`Subject: ${subjInput.value}\n\n${bodyInput.value}`);
    });
    item.querySelector(".mark-emailed").addEventListener("click", (e) => {
      setOverride(e.target.dataset.handle, "status", "Emailed");
      render();
    });

    body.appendChild(item);
  });

  modal.classList.remove("hidden");
}

function closeDraftModal() {
  document.getElementById("draftModal").classList.add("hidden");
}

function exportCsv() {
  const header = ["priority", "handle", "platform", "angle", "whyFit", "caveat", "email", "rate", "status"];
  const lines = [header.join(",")];
  creators.forEach((c) => {
    const row = getRow(c.handle);
    const vals = header.map((h) => {
      const v = h in row ? row[h] : c[h];
      return `"${String(v ?? "").replace(/"/g, '""')}"`;
    });
    lines.push(vals.join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flip-creator-outreach.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function init() {
  loadOverrides();
  fetch("creators.json")
    .then((r) => r.json())
    .then((data) => {
      creators = data;
      render();
    });

  ["filterPriority", "filterStatus"].forEach((id) =>
    document.getElementById(id).addEventListener("change", render)
  );
  document.getElementById("search").addEventListener("input", render);
  document.getElementById("exportCsv").addEventListener("click", exportCsv);
  document.getElementById("closeModal").addEventListener("click", closeDraftModal);
  document.getElementById("draftModal").addEventListener("click", (e) => {
    if (e.target.id === "draftModal") closeDraftModal();
  });
  document.getElementById("selectAll").addEventListener("change", (e) => {
    document.querySelectorAll(".row-check").forEach((cb) => (cb.checked = e.target.checked));
  });
  document.getElementById("composeSelected").addEventListener("click", () => {
    const handles = Array.from(document.querySelectorAll(".row-check:checked")).map((cb) => cb.dataset.handle);
    if (handles.length === 0) {
      alert("Select one or more creators first (checkbox in the left column).");
      return;
    }
    openDraftModal(handles);
  });
}

document.addEventListener("DOMContentLoaded", init);
