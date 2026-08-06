import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Chequemart, you agree to be bound by these Terms of Service.</p>
        
        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years old to use this platform. By registering, you represent that you meet this requirement.</p>
        
        <h2>3. User Obligations</h2>
        <p>You agree to provide accurate information during registration and keep your account credentials secure.</p>
        
        <h2>4. Payment Terms & Escrow</h2>
        <p>All payments are processed through Paystack. Funds are held in escrow until the buyer confirms delivery. Once confirmed, funds are released to the seller minus platform commission.</p>
        
        <h2>5. Dispute Resolution</h2>
        <p>Disputes must be raised within 5 days of delivery. Chequemart admin will review evidence and make a final decision.</p>
        
        <h2>6. Limitation of Liability</h2>
        <p>Chequemart acts as an intermediary and is not liable for disputes between buyers and sellers beyond the escrow amount.</p>
        
        <h2>7. Account Suspension</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
        
        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
        
        <h2>9. Changes to Terms</h2>
        <p>We may update these terms at any time. Continued use after changes constitutes acceptance.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
