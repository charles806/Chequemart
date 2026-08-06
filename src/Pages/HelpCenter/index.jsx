import React, { useState } from 'react';

const HelpCenter = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit ticket:', err);
    }
  };

  const faqs = [
    { q: 'How do I register?', a: 'Click "Sign Up" and provide your name, email or phone, and password.' },
    { q: 'How does escrow work?', a: 'When you order, funds are held securely. They are released to the seller only after you confirm delivery.' },
    { q: 'How do I withdraw money?', a: 'Go to your Wallet, enter the amount and bank details, then click Withdraw.' },
    { q: 'How do I open a dispute?', a: 'Go to your Orders, find the order, and click "Open Dispute". Provide evidence for faster resolution.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="border rounded-lg p-4">
              <summary className="font-medium cursor-pointer">{faq.q}</summary>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
            Thank you! We'll get back to you within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg px-4 py-2"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
            <textarea
              placeholder="How can we help?"
              className="w-full border rounded-lg px-4 py-2 h-32"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default HelpCenter;
