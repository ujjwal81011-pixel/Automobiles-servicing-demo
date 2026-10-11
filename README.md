# ApexAutoCare.com | Modern Automobile Servicing & Telemetry Portal

A state-of-the-art, mobile-friendly automobile servicing platform built with modern HTML5, Vanilla CSS, and JavaScript. Featuring domain-based branding, an interactive live service bay radar tracker, an instant cost estimator, and responsive touch controls.

![Hero Workshop](assets/images/hero.jpg)

## 🚀 Key Highlights

* **Domain-Based Architecture**: In place of traditional entity names, all staff leads, customer handles, service hubs, and diagnostic telemetry nodes use domain-based identifiers (e.g. `ApexAutoCare.com`, `diagnostics.turboscan.io`, `powertrain.v8master.tech`, `central-hub.apexautocare.com`).
* **Live Service Bay Tracker (Radar)**:
  * Visual progress stepper tracking vehicle intake through 120-point telemetry, precision mechanical servicing, 3D laser alignment, and final road QC.
  * Real-time countdown clock and technician telemetry notes.
  * Demo tokens and support for custom Job Token inputs.
* **Instant Service Cost Estimator**:
  * Real-time calculation based on vehicle category multipliers (Sedan, SUV, Luxury, EV, Truck).
  * Dynamic breakdown with duration estimation and instant booking pre-fill.
* **Mobile-First Responsiveness**:
  * Off-canvas mobile navigation drawer.
  * Sticky mobile bottom quick-action bar with 1-tap thumb navigation for Calculator, Live Radar, Booking, and 24/7 SOS dispatch.
  * Fully fluid grid and typography.

## 📁 Repository Structure

```
├── index.html        # Main HTML5 layout and semantic structure
├── styles.css        # Vanilla CSS design system, dark mode & responsive media queries
├── app.js            # Live radar simulation, cost estimator & booking modal logic
├── assets/
│   └── images/
│       ├── hero.jpg          # Workshop bay showcase
│       ├── diagnostics.jpg   # Computer telemetry & ECU scanner
│       └── brakes.jpg        # High-performance Brembo brake service
└── README.md         # Documentation
```

## 🛠️ Local Development

To run this project locally, simply start a lightweight HTTP server:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js
npx serve .
```

Open your browser and navigate to `http://localhost:8080`.

## 📄 License

MIT License. Designed and engineered for modern automotive servicing networks.
