import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initialBrands, initialDeals, initialAnalytics } from './data.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let brands = [...initialBrands];
let deals = [...initialDeals];
let analytics = { ...initialAnalytics };

// Stages definition
const STAGES = [
  'INQUIRY',
  'NEGOTIATION',
  'CONTRACT_SIGNED',
  'DELIVERABLES_IN_PROGRESS',
  'INVOICED',
  'PAID'
];

// Health
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'UP', service: 'Creator Business Manager API', version: '1.0.0' });
});

// Brands
app.get('/api/v1/brands', (req, res) => {
  res.json(brands);
});

// Deals / Pipeline
app.get('/api/v1/deals', (req, res) => {
  res.json(deals);
});

app.post('/api/v1/deals', (req, res) => {
  const { brandName, campaignTitle, value, deliverableType, targetPublishDate, notes } = req.body;
  
  const newDeal = {
    id: `DEAL-${Math.floor(100 + Math.random() * 900)}`,
    brandId: `BRD-${Math.floor(1 + Math.random() * 99)}`,
    brandName: brandName || 'New Sponsor Brand',
    campaignTitle: campaignTitle || 'Sponsored Campaign',
    value: Number(value) || 5000,
    stage: 'INQUIRY',
    probability: 30,
    deliverableType: deliverableType || '60s Dedicated Segment',
    targetPublishDate: targetPublishDate || '2027-01-30',
    contractSignedDate: null,
    invoiceNumber: null,
    paymentDueDate: null,
    notes: notes || 'Fresh brand inquiry via DealRadar.',
    timeline: [
      { step: "Brand Inquiry", date: new Date().toISOString().split('T')[0], status: "ACTIVE", note: "Inbound campaign inquiry" },
      { step: "Rate & Deliverable Negotiation", date: "Pending", status: "PENDING", note: "" },
      { step: "Master Services Agreement (MSA)", date: "Pending", status: "PENDING", note: "" },
      { step: "Content Production & Delivery", date: "Pending", status: "PENDING", note: "" },
      { step: "Invoicing", date: "Pending", status: "PENDING", note: "" },
      { step: "Payment Received", date: "Pending", status: "PENDING", note: "" }
    ]
  };

  deals.unshift(newDeal);
  res.status(201).json(newDeal);
});

// Standout Feature: Progress Deal Lifecycle Stage
app.patch('/api/v1/deals/:id/advance-stage', (req, res) => {
  const { id } = req.params;
  const deal = deals.find(d => d.id === id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  const currentIndex = STAGES.indexOf(deal.stage);
  if (currentIndex < STAGES.length - 1) {
    const nextStage = STAGES[currentIndex + 1];
    deal.stage = nextStage;

    const todayStr = new Date().toISOString().split('T')[0];

    // Update timeline and stage specific artifacts
    if (nextStage === 'NEGOTIATION') {
      deal.probability = 50;
      deal.timeline[0].status = 'COMPLETED';
      deal.timeline[1].status = 'ACTIVE';
      deal.timeline[1].date = todayStr;
      deal.timeline[1].note = 'Actively negotiating CPM deliverables & scope';
    } else if (nextStage === 'CONTRACT_SIGNED') {
      deal.probability = 85;
      deal.contractSignedDate = todayStr;
      deal.timeline[1].status = 'COMPLETED';
      deal.timeline[2].status = 'ACTIVE';
      deal.timeline[2].date = todayStr;
      deal.timeline[2].note = 'MSA and SOW executed by creator and brand';
    } else if (nextStage === 'DELIVERABLES_IN_PROGRESS') {
      deal.probability = 95;
      deal.timeline[2].status = 'COMPLETED';
      deal.timeline[3].status = 'ACTIVE';
      deal.timeline[3].date = todayStr;
      deal.timeline[3].note = 'Filming & editing in progress';
    } else if (nextStage === 'INVOICED') {
      deal.probability = 100;
      deal.invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      deal.paymentDueDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
      deal.timeline[3].status = 'COMPLETED';
      deal.timeline[4].status = 'ACTIVE';
      deal.timeline[4].date = todayStr;
      deal.timeline[4].note = `Issued invoice ${deal.invoiceNumber} (Net 30 terms)`;
    } else if (nextStage === 'PAID') {
      deal.probability = 100;
      deal.timeline[4].status = 'COMPLETED';
      deal.timeline[5].status = 'COMPLETED';
      deal.timeline[5].date = todayStr;
      deal.timeline[5].note = `Payment of $${deal.value.toLocaleString()} cleared`;
      analytics.totalRevenueYearToDate += deal.value;
    }

    return res.json({ message: `Deal advanced to ${nextStage}`, deal });
  }

  res.json({ message: 'Deal is already at final PAID stage', deal });
});

// Analytics
app.get('/api/v1/analytics', (req, res) => {
  const activePipelineValue = deals
    .filter(d => d.stage !== 'PAID')
    .reduce((sum, d) => sum + d.value, 0);

  const pendingInvoicesAmount = deals
    .filter(d => d.stage === 'INVOICED')
    .reduce((sum, d) => sum + d.value, 0);

  res.json({
    ...analytics,
    activePipelineValue,
    pendingInvoicesAmount,
    totalDealsCount: deals.length
  });
});

app.listen(PORT, () => {
  console.log(`Creator Business Manager API running on port ${PORT}`);
});
