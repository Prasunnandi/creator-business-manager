// Seed data for Creator Business & Collaboration Manager (CreatorDesk + DealRadar)

export const initialBrands = [
  {
    id: "BRD-1",
    name: "Supabase",
    industry: "Developer Tools / Cloud DB",
    contactPerson: "Elena Vance",
    email: "sponsorships@supabase.com",
    tier: "Tier 1 Enterprise",
    pastDealsCount: 3,
    avgDealValue: 8500
  },
  {
    id: "BRD-2",
    name: "Linear App",
    industry: "Productivity & Issue Tracking",
    contactPerson: "Tuomas Artman",
    email: "growth@linear.app",
    tier: "Tier 1 Enterprise",
    pastDealsCount: 2,
    avgDealValue: 12000
  },
  {
    id: "BRD-3",
    name: "Datadog",
    industry: "Cloud Monitoring & APM",
    contactPerson: "Sarah Jenkins",
    email: "creator-partners@datadog.com",
    tier: "Enterprise Sponsor",
    pastDealsCount: 1,
    avgDealValue: 15000
  },
  {
    id: "BRD-4",
    name: "Nord Security",
    industry: "Cybersecurity & VPN",
    contactPerson: "Marcus Vance",
    email: "affiliates@nordpass.com",
    tier: "Consumer Tech",
    pastDealsCount: 5,
    avgDealValue: 6000
  }
];

export const initialDeals = [
  {
    id: "DEAL-101",
    brandId: "BRD-1",
    brandName: "Supabase",
    campaignTitle: "Postgres & AI Vector Embeddings Full Tutorial Integration",
    value: 9500,
    stage: "DELIVERABLES_IN_PROGRESS", // INQUIRY -> NEGOTIATION -> CONTRACT_SIGNED -> DELIVERABLES_IN_PROGRESS -> INVOICED -> PAID
    probability: 90,
    deliverableType: "Dedicated 60s Integration + Newsletter Blast",
    targetPublishDate: "2026-12-05",
    contractSignedDate: "2026-11-15",
    invoiceNumber: "INV-2026-088",
    paymentDueDate: "2027-01-05",
    notes: "Requires draft preview approval 48 hours before live publishing.",
    timeline: [
      { step: "Brand Inquiry", date: "2026-11-02", status: "COMPLETED", note: "Inbound agency pitch received" },
      { step: "Rate & Deliverable Negotiation", date: "2026-11-08", status: "COMPLETED", note: "Agreed at $9,500 fixed fee" },
      { step: "Master Services Agreement (MSA)", date: "2026-11-15", status: "COMPLETED", note: "Docusign signed by both parties" },
      { step: "Content Production & Delivery", date: "2026-11-25", status: "ACTIVE", note: "B-roll recorded; editing rough cut" },
      { step: "Invoicing", date: "Pending", status: "PENDING", note: "Net-30 invoice triggers on publish" },
      { step: "Payment Received", date: "Pending", status: "PENDING", note: "Wire transfer" }
    ]
  },
  {
    id: "DEAL-102",
    brandId: "BRD-2",
    brandName: "Linear App",
    campaignTitle: "Engineering Velocity & Sprint Planning Workflow Video",
    value: 12500,
    stage: "INVOICED",
    probability: 100,
    deliverableType: "Dedicated Segment + X/Twitter Thread",
    targetPublishDate: "2026-11-18",
    contractSignedDate: "2026-10-28",
    invoiceNumber: "INV-2026-079",
    paymentDueDate: "2026-12-18",
    notes: "Video went live on Nov 18; invoice sent to finance.",
    timeline: [
      { step: "Brand Inquiry", date: "2026-10-14", status: "COMPLETED", note: "Brand approached for Q4 launch" },
      { step: "Rate & Deliverable Negotiation", date: "2026-10-20", status: "COMPLETED", note: "Scoped custom workflow demo" },
      { step: "Master Services Agreement (MSA)", date: "2026-10-28", status: "COMPLETED", note: "Executed agreement" },
      { step: "Content Production & Delivery", date: "2026-11-18", status: "COMPLETED", note: "Video live with 84,000 views" },
      { step: "Invoicing", date: "2026-11-19", status: "ACTIVE", note: "Invoice INV-2026-079 generated (Net 30)" },
      { step: "Payment Received", date: "Pending", status: "PENDING", note: "Awaiting ACH transfer" }
    ]
  },
  {
    id: "DEAL-103",
    brandId: "BRD-3",
    brandName: "Datadog",
    campaignTitle: "Distributed Tracing & Kubernetes APM Deep-Dive",
    value: 16000,
    stage: "NEGOTIATION",
    probability: 60,
    deliverableType: "2x Dedicated YouTube Episodes + Discord AMA",
    targetPublishDate: "2027-01-15",
    contractSignedDate: null,
    invoiceNumber: null,
    paymentDueDate: null,
    notes: "Reviewing clause on 90-day exclusivity with other APM vendors.",
    timeline: [
      { step: "Brand Inquiry", date: "2026-11-10", status: "COMPLETED", note: "Enterprise marketing lead outreach" },
      { step: "Rate & Deliverable Negotiation", date: "2026-11-18", status: "ACTIVE", note: "Redlining exclusivity clause" },
      { step: "Master Services Agreement (MSA)", date: "Pending", status: "PENDING", note: "Pending legal approval" },
      { step: "Content Production & Delivery", date: "Pending", status: "PENDING", note: "Scripting outline" },
      { step: "Invoicing", date: "Pending", status: "PENDING", note: "" },
      { step: "Payment Received", date: "Pending", status: "PENDING", note: "" }
    ]
  },
  {
    id: "DEAL-104",
    brandId: "BRD-4",
    brandName: "Nord Security",
    campaignTitle: "Cyber Week Hardware Wallet & Password Vault Promo",
    value: 7200,
    stage: "PAID",
    probability: 100,
    deliverableType: "90s Pre-roll + Community Tab Post",
    targetPublishDate: "2026-11-05",
    contractSignedDate: "2026-10-15",
    invoiceNumber: "INV-2026-064",
    paymentDueDate: "2026-11-20",
    notes: "Paid in full via Stripe.",
    timeline: [
      { step: "Brand Inquiry", date: "2026-10-01", status: "COMPLETED", note: "Inbound campaign request" },
      { step: "Rate & Deliverable Negotiation", date: "2026-10-08", status: "COMPLETED", note: "Standard creator package" },
      { step: "Master Services Agreement (MSA)", date: "2026-10-15", status: "COMPLETED", note: "Signed" },
      { step: "Content Production & Delivery", date: "2026-11-05", status: "COMPLETED", note: "Published on schedule" },
      { step: "Invoicing", date: "2026-11-06", status: "COMPLETED", note: "Invoice processed" },
      { step: "Payment Received", date: "2026-11-19", status: "COMPLETED", note: "Funds deposited ($7,200)" }
    ]
  }
];

export const initialAnalytics = {
  totalRevenueYearToDate: 84600,
  activePipelineValue: 38000,
  pendingInvoicesAmount: 12500,
  averageCpmYield: 34.50,
  stageConversionRates: {
    inquiryToNegotiation: 75,
    negotiationToContract: 82,
    contractToDelivered: 98,
    deliveredToPaid: 100
  }
};
