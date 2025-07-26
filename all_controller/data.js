// data.js
module.exports = {
  merchantInfo: {
    name: "Ghost Busters Pvt. Ltd.",
    mid: "CRED00192",
    cfd: "SM3019458",
    gstin: "3AAACG12345E",
    pan: "AAACC3570R",
    address: "No. 123 Floor, Castle Block, Northern Region, 7 Roads",
    fromDate: "12/01/2025",
    toDate: "18/01/2025",
    generatedOn: "29/01/2025 2:10 PM",
    supportContact: "+91 98765 43210",
    supportMail: "support@support.com",
    website: "www.support.com"
  },

  settlementSummary: [
    {
      transactionDate: "-",
      gross: 10000,
      fee: 100,
      gst: 18,
      netPayable: 9800,
      refund: 82,
      chargeback: 0,
      netSettlement: 9800
    }
  ],

  posSummary: [
    {
      bank: "HDFC",
      txnCount: 5,
      visa: 3,
      master: 1,
      rupay: 1,
      amount: 10000,
      net: 9800
    }
  ],

  additionalFees: [
    {
      txnId: "CFD10001",
      date: "21/01/2025",
      feeType: "Service Fee",
      debit: 10.18,
      credit: 0
    },
    {
      txnId: "CFD10002",
      date: "21/01/2025",
      feeType: "GST",
      debit: 1.83,
      credit: 0
    }
  ]
};
