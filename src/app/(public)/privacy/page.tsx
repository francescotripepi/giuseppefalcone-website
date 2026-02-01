import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for giuseppefalcone.com",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Information We Collect</h2>
          <p>
            When you use our website, we may collect the following information:
          </p>
          <ul>
            <li>Contact information (name, email, phone) when you submit a booking request</li>
            <li>Event details you provide for booking inquiries</li>
            <li>Technical data (IP address, browser type) for analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Respond to booking inquiries</li>
            <li>Send relevant event updates (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We do not sell
            or share your personal information with third parties except as necessary to
            process your booking requests.
          </p>

          <h2>4. Cookies</h2>
          <p>
            We use essential cookies to ensure the website functions properly. We may also
            use analytics cookies to understand how visitors use our site. See our{" "}
            <a href="/cookies" className="text-[#ff0080] hover:underline">
              Cookie Policy
            </a>{" "}
            for more details.
          </p>

          <h2>5. Your Rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
            <a
              href="mailto:privacy@giuseppefalcone.com"
              className="text-[#ff0080] hover:underline"
            >
              privacy@giuseppefalcone.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
