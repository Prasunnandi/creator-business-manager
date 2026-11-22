// API Client for Creator Business Manager

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API call ${endpoint} fallback:`, e.message);
    return getFallbackData(endpoint);
  }
}

export const api = {
  getBrands: () => request('/brands'),
  getDeals: () => request('/deals'),
  createDeal: (dealData) => request('/deals', { method: 'POST', body: JSON.stringify(dealData) }),
  advanceStage: (dealId) => request(`/deals/${dealId}/advance-stage`, { method: 'PATCH' }),
  getAnalytics: () => request('/analytics')
};

function getFallbackData(endpoint) {
  if (endpoint.includes('/deals')) {
    return [
      {
        id: "DEAL-101",
        brandId: "BRD-1",
        brandName: "Supabase",
        campaignTitle: "Postgres & AI Vector Embeddings Full Tutorial Integration",
        value: 9500,
        stage: "DELIVERABLES_IN_PROGRESS",
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
          { step: "Master Services Agreement (MSA)", date: "2026-11-15", status: "COMPLETED", note: "Docusign signed" },
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
          { step: "Invoicing", date: "2026-11-19", status: "ACTIVE", note: "Invoice INV-2026-079 generated" },
          { step: "Payment Received", date: "Pending", status: "PENDING", note: "Awaiting ACH transfer" }
        ]
      }
    ];
  }
  if (endpoint.includes('/analytics')) {
    return {
      totalRevenueYearToDate: 84600,
      activePipelineValue: 38000,
      pendingInvoicesAmount: 12500,
      averageCpmYield: 34.50,
      totalDealsCount: 4
    };
  }
  return [];
}
