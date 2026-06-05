import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Tilal Binghatti Residences',
  description: 'Terms of Service for Tilal Binghatti Residences',
};

export default function TermsOfServicePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight text-fg">
          Terms of Service
        </h1>
        <div className="prose prose-lg prose-headings:font-display prose-headings:text-fg prose-p:text-fg-muted prose-a:text-gold hover:prose-a:text-gold-light max-w-none">
          <p><em>Last Updated: June 2026</em></p>

          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and 
            <strong> QHTECH SOLUTIONS L.L.C</strong>, operating as a marketing firm for Tilal Binghatti Residences ("we," "us," or "our"), 
            concerning your access to and use of the Tilal Binghatti Residences website as well as any other media form, media channel, mobile website, 
            or mobile application related, linked, or otherwise connected thereto.
          </p>
          <p>
            QHTECH SOLUTIONS L.L.C is registered at Meydan Road, Nad Ali Sheba, Dubai, U.A.E. By accessing the site, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the site and you must discontinue use immediately.
          </p>

          <h2>2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United Arab Emirates, international copyright laws, and international conventions.
          </p>

          <h2>3. User Representations</h2>
          <p>By using the Site, you represent and warrant that:</p>
          <ul>
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You are not a minor in the jurisdiction in which you reside.</li>
            <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            <li>Your use of the Site will not violate any applicable law or regulation.</li>
          </ul>

          <h2>4. Prohibited Activities</h2>
          <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          <p>As a user of the Site, you agree not to:</p>
          <ul>
            <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Site.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
            <li>Use any information obtained from the Site in order to harass, abuse, or harm another person.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
          </ul>

          <h2>5. Third-Party Websites and Content</h2>
          <p>
            The Site may contain (or you may be sent via the Site) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Site or any Third-Party Content posted on, available through, or installed from the Site.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These Terms shall be governed by and defined following the laws of the United Arab Emirates. QHTECH SOLUTIONS L.L.C and yourself irrevocably consent that the courts of Dubai shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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
