import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-neutral-900">Privacy Policy</h1>
      <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">1. Information We Collect</h2>
          <p>We collect personal information you provide: name, email, phone number, delivery addresses, and payment information.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">2. How We Use Your Data</h2>
          <p>We use your data to process orders, facilitate payments, provide customer support, and improve our services.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">3. Third-Party Sharing</h2>
          <p>We share necessary data with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-neutral-700">Paystack</strong> — Payment processing</li>
            <li><strong className="text-neutral-700">Cloudinary</strong> — Image hosting</li>
            <li><strong className="text-neutral-700">Sentry</strong> — Error monitoring</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">4. Data Security</h2>
          <p>We implement encryption, access controls, and regular security audits to protect your data.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at support@chequemart.com.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">6. Data Retention</h2>
          <p>We retain your data for as long as your account is active and for 3 years after account closure for regulatory purposes.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">7. Contact</h2>
          <p>For privacy inquiries: privacy@chequemart.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
