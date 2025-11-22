// src/services/analytics/models/Metric.js
export class Metric {
  constructor({ id, icon, label, value, trend, detail }) {
    this.id = id;
    this.icon = icon;
    this.label = label;
    this.value = value;
    this.trend = trend;
    this.detail = detail;
  }
}
