// src/services/analytics/models/Kpi.js
export class Kpi {
  constructor({ id, icon, label, value, trend, bgColor, accentColor, progress, detail }) {
    this.id = id;
    this.icon = icon;
    this.label = label;
    this.value = value;
    this.trend = trend;
    this.bgColor = bgColor;
    this.accentColor = accentColor;
    this.progress = progress;
    this.detail = detail;
  }
}
