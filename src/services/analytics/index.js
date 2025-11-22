// src/services/analytics/index.js
import { 
    detailedDashboardMetrics, 
    audienceDemographics, 
    contentPerformance, 
    campaignResults,
    topPerformingPosts,
    audienceGrowth,
    recentActivities,
    reportNetworkPerformance
} from './data/seed.js';
import { Metric } from './models/Metric.js';

const getDashboardMetrics = () => {
  return detailedDashboardMetrics.map(data => new Metric(data));
};

const getAudienceDemographics = () => {
  return audienceDemographics;
};

const getContentPerformance = () => {
  return contentPerformance;
};

const getCampaignResults = () => {
  return campaignResults;
};

const getTopPerformingPosts = () => {
    return topPerformingPosts;
};

const getAudienceGrowth = () => {
    return audienceGrowth;
};

const getRecentActivities = () => {
    return recentActivities;
};

const getReportNetworkPerformance = () => {
    return reportNetworkPerformance;
};

export const analyticsModule = {
  getDashboardMetrics,
  getAudienceDemographics,
  getContentPerformance,
  getCampaignResults,
  getTopPerformingPosts,
  getAudienceGrowth,
  getRecentActivities,
  getReportNetworkPerformance,
};
