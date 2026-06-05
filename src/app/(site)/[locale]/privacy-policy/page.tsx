import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tilal Binghatti Residences',
  description: 'Privacy Policy for Tilal Binghatti Residences',
};

export default function PrivacyPolicyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight text-fg">
          Privacy Policy
        </h1>
        <div className="prose prose-lg prose-headings:font-display prose-headings:text-fg prose-p:text-fg-muted prose-a:text-gold hover:prose-a:text-gold-light max-w-none">
          <p><em>Last Updated: June 2026</em></p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to Tilal Binghatti Residences. This Privacy Policy outlines how <strong>QHTECH SOLUTIONS L.L.C</strong> 
            (registered at Meydan Road, Nad Ali Sheba, Dubai, U.A.E), acting as a marketing firm for Tilal Binghatti Residences 
            ("we," "our," or "us"), collects, uses, protects, and discloses your personal information when you visit our website 
            and use our services.
          </p>
          <p>
            We are committed to protecting your privacy and ensuring that your personal data is handled in compliance with applicable 
            data protection laws, including the regulations of the United Arab Emirates.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We may collect and process the following types of personal information:</p>
          <ul>
            <li><strong>Identity Data:</strong> First name, last name, title, and other identifiers.</li>
            <li><strong>Contact Data:</strong> Email address, telephone numbers, and residential address.</li>
            <li><strong>Technical Data:</strong> Internet Protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
            <li><strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and our third parties, and your communication preferences.</li>
          </ul>

          <h2>3. How We Collect Your Data</h2>
          <p>We use different methods to collect data from and about you, including through:</p>
          <ul>
            <li><strong>Direct Interactions:</strong> You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email, or otherwise. This includes personal data you provide when you inquire about our properties, subscribe to our publications, or request marketing to be sent to you.</li>
            <li><strong>Automated Technologies or Interactions:</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this personal data by using cookies, server logs, and other similar technologies.</li>
          </ul>

          <h2>4. How We Use Your Personal Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>

          <h2>5. Disclosures of Your Personal Data</h2>
          <p>
            We may have to share your personal data with third parties for the purposes set out in Section 4. 
            This includes service providers acting as processors based in the UAE who provide IT and system administration services, 
            professional advisers acting as processors or joint controllers, and regulators or other authorities. 
            We require all third parties to respect the security of your personal data and to treat it in accordance with the law.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data, and applicable legal requirements.
          </p>

          <h2>8. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. These may include the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p>
            <strong>QHTECH SOLUTIONS L.L.C</strong><br />
            Meydan Road, Nad Ali Sheba<br />
            Dubai, U.A.E<br />
            Email: sales@tilalbinghattiresidences.com
          </p>
        </div>
      </div>
    </main>
  );
}
