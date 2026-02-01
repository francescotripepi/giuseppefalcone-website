import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for giuseppefalcone.com",
};

export default function CookiesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a
            website. They help the website remember your preferences and understand how
            you use the site.
          </p>

          <h2>Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable
            basic features like page navigation and access to secure areas.
          </p>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Cookie</th>
                <th className="text-left">Purpose</th>
                <th className="text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session</td>
                <td>Maintains user session</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>

          <h3>Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by
            collecting and reporting information anonymously.
          </p>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Cookie</th>
                <th className="text-left">Purpose</th>
                <th className="text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics - visitor tracking</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics - session tracking</td>
                <td>24 hours</td>
              </tr>
            </tbody>
          </table>

          <h2>Managing Cookies</h2>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies
            that are already on your computer and you can set most browsers to prevent
            them from being placed. If you do this, however, you may have to manually
            adjust some preferences every time you visit a site and some services and
            functionalities may not work.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about our cookie policy, contact us at{" "}
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
