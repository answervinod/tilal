import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Tilal Binghatti Residences',
  description: 'Cookie Policy for Tilal Binghatti Residences',
};

export default function CookiePolicyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight text-fg">
          Cookie Policy
        </h1>
        <div className="prose prose-lg prose-headings:font-display prose-headings:text-fg prose-p:text-fg-muted prose-a:text-gold hover:prose-a:text-gold-light max-w-none">
          <p><em>Last Updated: June 2026</em></p>

          <h2>1. Introduction</h2>
          <p>
            This Cookie Policy explains how <strong>QHTECH SOLUTIONS L.L.C</strong>, acting as a marketing firm for 
            Tilal Binghatti Residences ("we", "us", and "our"), uses cookies and similar technologies to recognize you when you visit 
            our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>

          <h2>2. What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, QHTECH SOLUTIONS L.L.C) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., like advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </p>

          <h2>3. Why do we use cookies?</h2>
          <p>We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our online properties. Third parties serve cookies through our website for advertising, analytics, and other purposes.</p>

          <h2>4. Types of cookies we use</h2>
          <ul>
            <li><strong>Essential website cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
            <li><strong>Performance and functionality cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.</li>
            <li><strong>Analytics and customization cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
            <li><strong>Advertising cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</li>
          </ul>

          <h2>5. How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
          </p>
          <p>
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>

          <h2>6. Updates to this Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please contact us at:
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
