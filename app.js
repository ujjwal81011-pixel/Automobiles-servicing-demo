/**
 * ApexAutoCare.com - Automobile Servicing & Telemetry Diagnostics Logic
 * All branding, staff leads, reviews, and nodes use domain-based identifiers.
 */

// =============================================================================
// 1. DATA STORES (DEMO TRACKING JOBS & PRICING PRESETS)
// =============================================================================

const DEMO_JOBS = {
  'JOB-8821.apexautocare.com': {
    token: 'JOB-8821.apexautocare.com',
    car: '2024 Porsche 911 GT3 (Twin Turbo)',
    statusBadge: 'IN PROGRESS // ACTIVE BAY 03',
    engineerDomain: 'diagnostics.turboscan.io',
    bayId: 'central-hub.apexautocare.com #03',
    progressPercent: 58,
    remainingSeconds: 2538, // ~42 mins
    activeStepIndex: 2, // 0-indexed: step 3 is active
    steps: [
      { name: '1. Vehicle Intake', time: '09:15 AM - Completed', state: 'completed' },
      { name: '2. 120-Pt Telemetry Scan', time: '09:40 AM - Completed', state: 'completed' },
      { name: '3. Precision Servicing', time: 'In Progress (Bay 03)', state: 'active' },
      { name: '4. 3D Laser Alignment', time: 'Queue Standby', state: 'pending' },
      { name: '5. Road QC & Detailing', time: 'Queue Standby', state: 'pending' },
      { name: '6. Ready for Pickup', time: 'Final Handoff', state: 'pending' }
    ],
    techNotes: '"ECU flashing complete. 0 error codes detected across CAN-bus lines. Brake fluid dry boiling point tested at 310°C (optimal). Installing Brembo ceramic compound components now."'
  },

  'JOB-4412.turbocare.tech': {
    token: 'JOB-4412.turbocare.tech',
    car: '2023 Tesla Model S Plaid (Tri-Motor)',
    statusBadge: 'FINAL QC // ROAD SIMULATION',
    engineerDomain: 'ev-diagnostics.voltcare.io',
    bayId: 'westend-hub.apexautocare.com #01',
    progressPercent: 88,
    remainingSeconds: 680, // ~11 mins
    activeStepIndex: 4,
    steps: [
      { name: '1. Vehicle Intake', time: '11:00 AM - Completed', state: 'completed' },
      { name: '2. 120-Pt Telemetry Scan', time: '11:20 AM - Completed', state: 'completed' },
      { name: '3. Precision Servicing', time: '12:05 PM - Completed', state: 'completed' },
      { name: '4. 3D Laser Alignment', time: '12:40 PM - Completed', state: 'completed' },
      { name: '5. Road QC & Detailing', time: 'Active Dynamic Road Test', state: 'active' },
      { name: '6. Ready for Pickup', time: 'Est. 1:15 PM', state: 'pending' }
    ],
    techNotes: '"High-voltage pack cell balancing verified at 99.4% symmetry. Coolant loop vacuum bled with zero air cavitation. Final chassis road test underway."'
  },

  'JOB-9903.gearshift.io': {
    token: 'JOB-9903.gearshift.io',
    car: '2022 BMW M4 Competition (G82)',
    statusBadge: 'COMPLETED // READY FOR PICKUP',
    engineerDomain: 'powertrain.v8master.tech',
    bayId: 'airport-express.apexautocare.com #04',
    progressPercent: 100,
    remainingSeconds: 0,
    activeStepIndex: 5,
    steps: [
      { name: '1. Vehicle Intake', time: '08:00 AM - Completed', state: 'completed' },
      { name: '2. 120-Pt Telemetry Scan', time: '08:25 AM - Completed', state: 'completed' },
      { name: '3. Precision Servicing', time: '09:10 AM - Completed', state: 'completed' },
      { name: '4. 3D Laser Alignment', time: '09:45 AM - Completed', state: 'completed' },
      { name: '5. Road QC & Detailing', time: '10:15 AM - Completed', state: 'completed' },
      { name: '6. Ready for Pickup', time: 'Verified at Express Lounge', state: 'completed' }
    ],
    techNotes: '"Full Motul 300V motorsport fluid flush completed. Titanium exhaust alignment adjusted. Vehicle cleaned and parked at Express Gate 04 ready for key handover."'
  }
};

let currentTrackedJob = DEMO_JOBS['JOB-8821.apexautocare.com'];
let timerIntervalId = null;

// =============================================================================
// 2. INITIALIZATION ON DOM READY
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileDrawer();
  initTracker();
  initEstimator();
  initServiceFilters();
  initBookingModal();
  setDefaultBookingDate();
});

// =============================================================================
// 3. NAVBAR & SCROLL BEHAVIOR
// =============================================================================

function initNavbarScroll() {
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const navHeight = document.getElementById('mainHeader').offsetHeight || 72;
    const targetPos = section.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
  }
}

// =============================================================================
// 4. MOBILE DRAWER NAVIGATION
// =============================================================================

function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerBookBtn = document.getElementById('drawerBookBtn');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeDrawer();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        setTimeout(() => scrollToSection(targetId), 250);
      }
    });
  });

  if (drawerBookBtn) {
    drawerBookBtn.addEventListener('click', () => {
      closeDrawer();
      openBookingModal();
    });
  }
}

// =============================================================================
// 5. LIVE BAY TRACKER (RADAR) LOGIC
// =============================================================================

function initTracker() {
  const trackSearchBtn = document.getElementById('trackSearchBtn');
  const trackerInput = document.getElementById('trackerInput');

  trackSearchBtn.addEventListener('click', () => {
    const query = trackerInput.value.trim();
    if (!query) {
      showToast('Please enter a valid Job ID token');
      return;
    }
    loadTrackerJob(query);
  });

  trackerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      trackSearchBtn.click();
    }
  });

  // Render initial job
  renderJobStatus(currentTrackedJob);
  startTimerCountdown();
}

function loadTrackerJob(token) {
  const chipButtons = document.querySelectorAll('.chip-btn');
  chipButtons.forEach(btn => {
    if (btn.textContent.trim() === token) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const input = document.getElementById('trackerInput');
  input.value = token;

  if (DEMO_JOBS[token]) {
    currentTrackedJob = DEMO_JOBS[token];
  } else {
    // Generate simulated dynamic job for any user custom input token
    currentTrackedJob = {
      token: token,
      car: 'Custom Vehicle Service Entry',
      statusBadge: 'VERIFIED // SYSTEM BAY ACTIVE',
      engineerDomain: 'diagnostics.turboscan.io',
      bayId: 'central-hub.apexautocare.com #02',
      progressPercent: 42,
      remainingSeconds: 2800,
      activeStepIndex: 2,
      steps: [
        { name: '1. Vehicle Intake', time: 'Telemetry Recorded', state: 'completed' },
        { name: '2. 120-Pt Telemetry Scan', time: 'Sensors OK', state: 'completed' },
        { name: '3. Precision Servicing', time: 'In Progress', state: 'active' },
        { name: '4. 3D Laser Alignment', time: 'Queue Standby', state: 'pending' },
        { name: '5. Road QC & Detailing', time: 'Queue Standby', state: 'pending' },
        { name: '6. Ready for Pickup', time: 'Pending completion', state: 'pending' }
      ],
      techNotes: `"Telemetry synced with ${token}. Vehicle inspection checklist passing with optimal diagnostics."`
    };
  }

  renderJobStatus(currentTrackedJob);
  startTimerCountdown();
  showToast(`Loaded live telemetry for ${token}`);
}

function renderJobStatus(job) {
  document.getElementById('jobStatusBadge').textContent = job.statusBadge;
  document.getElementById('jobCarTitle').textContent = job.car;
  document.getElementById('jobTokenDisplay').textContent = job.token;
  
  const engElem = document.getElementById('jobEngineerDisplay');
  engElem.textContent = job.engineerDomain;
  engElem.href = `mailto:${job.engineerDomain}`;

  document.getElementById('jobBayId').textContent = `Bay: ${job.bayId}`;
  document.getElementById('stepperFill').style.width = `${job.progressPercent}%`;
  document.getElementById('jobTechNotes').textContent = job.techNotes;

  // Render steps
  const stepsContainer = document.getElementById('stepperStepsList');
  stepsContainer.innerHTML = '';

  job.steps.forEach((step, index) => {
    const stepEl = document.createElement('div');
    stepEl.className = `step-item ${step.state}`;

    let iconContent = index + 1;
    if (step.state === 'completed') {
      iconContent = '✓';
    } else if (step.state === 'active') {
      iconContent = '<span class="step-pulse"></span>';
    }

    stepEl.innerHTML = `
      <div class="step-circle">${iconContent}</div>
      <div class="step-name">${step.name}</div>
      <div class="step-time">${step.time}</div>
    `;
    stepsContainer.appendChild(stepEl);
  });
}

function startTimerCountdown() {
  if (timerIntervalId) clearInterval(timerIntervalId);

  const clockEl = document.getElementById('jobTimerClock');

  function updateClockDisplay() {
    if (currentTrackedJob.remainingSeconds <= 0) {
      clockEl.textContent = 'Vehicle Ready for Handover';
      return;
    }
    const mins = Math.floor(currentTrackedJob.remainingSeconds / 60);
    const secs = currentTrackedJob.remainingSeconds % 60;
    clockEl.textContent = `${mins}m ${secs < 10 ? '0' : ''}${secs}s Remaining`;
  }

  updateClockDisplay();

  timerIntervalId = setInterval(() => {
    if (currentTrackedJob.remainingSeconds > 0) {
      currentTrackedJob.remainingSeconds--;
      updateClockDisplay();
    }
  }, 1000);
}

// =============================================================================
// 6. INSTANT SERVICE COST ESTIMATOR
// =============================================================================

let currentVehicleType = 'sedan';
let currentVehicleMultiplier = 1.0;
let currentVehicleName = 'Compact & Sedan';

function initEstimator() {
  const vehicleButtons = document.querySelectorAll('.vehicle-btn');
  vehicleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      vehicleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentVehicleType = btn.dataset.vehicle;
      currentVehicleMultiplier = parseFloat(btn.dataset.multiplier) || 1.0;
      currentVehicleName = btn.querySelector('.vehicle-title').textContent.trim();
      recalculateEstimator();
    });
  });

  const checkboxes = document.querySelectorAll('#servicesChecklist input[type="checkbox"]');
  checkboxes.forEach(chk => {
    chk.addEventListener('change', recalculateEstimator);
  });

  const bookWithEstimateBtn = document.getElementById('bookWithEstimateBtn');
  if (bookWithEstimateBtn) {
    bookWithEstimateBtn.addEventListener('click', () => {
      const selected = getSelectedEstimatorServices();
      if (selected.length === 0) {
        showToast('Please select at least one service package');
        return;
      }
      openBookingModalWithEstimates();
    });
  }

  recalculateEstimator();
}

function getSelectedEstimatorServices() {
  const checkboxes = document.querySelectorAll('#servicesChecklist input[type="checkbox"]:checked');
  const services = [];
  checkboxes.forEach(chk => {
    services.push({
      name: chk.dataset.name,
      basePrice: parseFloat(chk.dataset.price) || 0,
      duration: parseInt(chk.dataset.duration) || 30
    });
  });
  return services;
}

function recalculateEstimator() {
  const selected = getSelectedEstimatorServices();
  const breakdownList = document.getElementById('summaryBreakdownList');
  breakdownList.innerHTML = '';

  let subtotal = 0;
  let totalDurationMinutes = 0;

  if (selected.length === 0) {
    breakdownList.innerHTML = '<div class="breakdown-row" style="color: var(--text-muted);">No services selected yet. Select packages to calculate.</div>';
    document.getElementById('calcTotalPrice').textContent = '0';
    document.getElementById('calcTotalTime').textContent = '0m';
    return;
  }

  selected.forEach(svc => {
    const itemPrice = Math.round(svc.basePrice * currentVehicleMultiplier);
    subtotal += itemPrice;
    totalDurationMinutes += svc.duration;

    const row = document.createElement('div');
    row.className = 'breakdown-row';
    row.innerHTML = `
      <span class="breakdown-name">${svc.name}</span>
      <span class="breakdown-price">$${itemPrice}</span>
    `;
    breakdownList.appendChild(row);
  });

  // Category multiplier row if multiplier != 1.0
  if (currentVehicleMultiplier !== 1.0) {
    const multRow = document.createElement('div');
    multRow.className = 'breakdown-row';
    multRow.style.fontSize = '0.78rem';
    multRow.style.color = 'var(--accent-cyan)';
    multRow.innerHTML = `
      <span>Vehicle Class Tier Factor (${currentVehicleName})</span>
      <span>${currentVehicleMultiplier}x</span>
    `;
    breakdownList.appendChild(multRow);
  }

  document.getElementById('calcTotalPrice').textContent = subtotal;

  const hours = Math.floor(totalDurationMinutes / 60);
  const minutes = totalDurationMinutes % 60;
  let durationStr = '';
  if (hours > 0) durationStr += `${hours}h `;
  if (minutes > 0 || hours === 0) durationStr += `${minutes}m`;
  document.getElementById('calcTotalTime').textContent = durationStr;
}

function resetCalculator() {
  const checkboxes = document.querySelectorAll('#servicesChecklist input[type="checkbox"]');
  checkboxes.forEach((chk, index) => {
    chk.checked = (index < 2); // check first 2 by default
  });

  const vehicleButtons = document.querySelectorAll('.vehicle-btn');
  vehicleButtons.forEach((btn, idx) => {
    if (idx === 0) {
      btn.classList.add('active');
      currentVehicleType = 'sedan';
      currentVehicleMultiplier = 1.0;
      currentVehicleName = 'Compact & Sedan';
    } else {
      btn.classList.remove('active');
    }
  });

  recalculateEstimator();
  showToast('Estimator preferences reset');
}

function selectServiceFromCard(serviceName) {
  const checkboxes = document.querySelectorAll('#servicesChecklist input[type="checkbox"]');
  let matched = false;
  checkboxes.forEach(chk => {
    if (chk.dataset.name.toLowerCase().includes(serviceName.toLowerCase()) || 
        serviceName.toLowerCase().includes(chk.dataset.name.toLowerCase())) {
      chk.checked = true;
      matched = true;
    }
  });

  recalculateEstimator();
  scrollToSection('estimator');
  showToast(`Selected "${serviceName}" in Cost Estimator`);
}

// =============================================================================
// 7. SERVICES FILTER TABS
// =============================================================================

function initServiceFilters() {
  const filterPills = document.querySelectorAll('#serviceFilterBar .filter-pill');
  const serviceCards = document.querySelectorAll('#servicesCardsGrid .service-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.category;

      serviceCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// =============================================================================
// 8. BOOKING MODAL & DIGITAL PASS CREATION
// =============================================================================

function initBookingModal() {
  const modalBackdrop = document.getElementById('bookingModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtn = document.getElementById('openBookingModalBtn');

  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => openBookingModal());
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeBookingModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeBookingModal();
    }
  });
}

function openBookingModal(preferredHub = null) {
  const modalBackdrop = document.getElementById('bookingModalBackdrop');
  const formView = document.getElementById('modalFormView');
  const successView = document.getElementById('modalSuccessView');

  // Reset to form view
  formView.classList.remove('hidden');
  successView.classList.add('hidden');

  if (preferredHub) {
    const hubSelect = document.getElementById('bookHub');
    hubSelect.value = preferredHub;
  }

  // Sync current price estimate
  const currentTotal = document.getElementById('calcTotalPrice').textContent;
  document.getElementById('modalEstimatedPrice').textContent = `$${currentTotal}.00`;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openBookingModalWithEstimates() {
  openBookingModal();

  const selected = getSelectedEstimatorServices();
  const summaryText = selected.map(s => `• ${s.name}`).join('\n');
  const servicesTextarea = document.getElementById('bookSelectedServices');
  servicesTextarea.value = `Vehicle Category: ${currentVehicleName}\nRequested Services:\n${summaryText}`;
}

function closeBookingModal() {
  const modalBackdrop = document.getElementById('bookingModalBackdrop');
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function setDefaultBookingDate() {
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isoDate = tomorrow.toISOString().split('T')[0];
    dateInput.value = isoDate;
    dateInput.min = isoDate;
  }
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const clientDomain = document.getElementById('bookClientDomain').value.trim();
  const vehicle = document.getElementById('bookVehicle').value.trim();
  const hub = document.getElementById('bookHub').value;
  const dateVal = document.getElementById('bookDate').value;
  const timeVal = document.getElementById('bookTime').value;
  const priceVal = document.getElementById('modalEstimatedPrice').textContent;

  // Generate unique domain job token
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const generatedToken = `JOB-${randomNum}.apexautocare.com`;

  // Populate Pass View
  document.getElementById('passToken').textContent = generatedToken;
  document.getElementById('passVehicle').textContent = vehicle;
  document.getElementById('passClient').textContent = clientDomain;
  document.getElementById('passHub').textContent = hub;
  document.getElementById('passDateTime').textContent = `${dateVal} @ ${timeVal.split(' ')[0]} ${timeVal.split(' ')[1]}`;
  document.getElementById('passPrice').textContent = priceVal;

  // Create real entry in live tracker
  DEMO_JOBS[generatedToken] = {
    token: generatedToken,
    car: vehicle,
    statusBadge: 'CONFIRMED // INTAKE SCHEDULED',
    engineerDomain: 'diagnostics.turboscan.io',
    bayId: `${hub} #05`,
    progressPercent: 15,
    remainingSeconds: 3600,
    activeStepIndex: 0,
    steps: [
      { name: '1. Vehicle Intake', time: `${dateVal} Scheduled`, state: 'active' },
      { name: '2. 120-Pt Telemetry Scan', time: 'Queue Assigned', state: 'pending' },
      { name: '3. Precision Servicing', time: 'Bay Reserved', state: 'pending' },
      { name: '4. 3D Laser Alignment', time: 'Standby', state: 'pending' },
      { name: '5. Road QC & Detailing', time: 'Standby', state: 'pending' },
      { name: '6. Ready for Pickup', time: 'Standby', state: 'pending' }
    ],
    techNotes: `"Service reservation confirmed for ${clientDomain}. Dedicated bay held at ${hub}. Please present QR voucher at arrival."`
  };

  // Switch modal view to success
  document.getElementById('modalFormView').classList.add('hidden');
  document.getElementById('modalSuccessView').classList.remove('hidden');

  showToast(`Bay booked! Token: ${generatedToken}`);
}

function viewInTracker() {
  const token = document.getElementById('passToken').textContent;
  closeBookingModal();
  loadTrackerJob(token);
  scrollToSection('tracker');
}

// =============================================================================
// 9. TOAST NOTIFICATION COMPONENT
// =============================================================================

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">⚡</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
