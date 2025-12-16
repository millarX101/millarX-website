import { useEffect } from 'react'
import { MEDIA } from '../lib/supabase'

/**
 * Employer Guide - Print-friendly page for SME employers
 * Opens in new tab, styled for printing/saving as PDF
 */
export default function EmployerGuide() {
  // Auto-scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="employer-guide-page">
      <style>{`
        .employer-guide-page {
          margin: 0;
          padding: 32px;
          font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f4f4f5;
          color: #111827;
          min-height: 100vh;
        }
        .employer-guide-page * {
          box-sizing: border-box;
        }
        .guide-container {
          max-width: 1100px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          padding: 24px 32px 28px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }
        .guide-header {
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .guide-logo {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          object-fit: contain;
          background: #ffffff;
          padding: 4px;
          border: 1px solid #e5e7eb;
        }
        .brand-text-main {
          font-weight: 700;
          letter-spacing: 0.06em;
          font-size: 16px;
          text-transform: uppercase;
          color: #5b34c4;
        }
        .brand-text-sub {
          font-size: 12px;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 600;
        }
        .contact-strip {
          font-size: 12px;
          color: #4b5563;
          margin-top: 4px;
        }
        .contact-strip strong {
          color: #111827;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }
        .btn-print {
          border-radius: 999px;
          border: 1px solid rgba(91, 52, 196, 0.35);
          background: transparent;
          color: #5b34c4;
          padding: 8px 16px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-print:hover {
          background: #5b34c4;
          color: white;
        }
        .guide-title {
          font-size: 24px;
          color: #111827;
          margin: 6px 0 4px;
          font-weight: 700;
        }
        .guide-tagline {
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 8px;
        }
        .mission-box {
          font-size: 13px;
          color: #111827;
          background: #f5f3ff;
          border-radius: 12px;
          padding: 10px 12px;
          border: 1px solid #e0e7ff;
          margin-bottom: 20px;
        }
        .mission-box strong {
          color: #5b34c4;
        }
        .guide-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          padding: 18px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
          margin-top: 18px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .card-title {
          font-size: 15px;
          font-weight: 700;
        }
        .pill {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          background: #f1edff;
          color: #5b34c4;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          white-space: nowrap;
          border: 1px solid #e0e7ff;
        }
        .guide-card p {
          font-size: 13px;
          line-height: 1.6;
          margin: 4px 0 8px;
        }
        .checklist-section {
          margin-bottom: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          font-size: 12px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .checklist-section strong {
          color: #111827;
        }
        .checklist-section ul {
          margin: 4px 0 0 18px;
          padding: 0;
        }
        .checklist-section li {
          margin-bottom: 2px;
        }
        .checklist-section.highlight {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border: 1px solid #c4b5fd;
        }
        .checklist-section.highlight strong {
          color: #5b34c4;
        }
        .note {
          font-size: 11px;
          color: #4b5563;
          margin-top: 3px;
          margin-bottom: 0;
        }
        .guide-footer {
          margin-top: 14px;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 11px;
          color: #4b5563;
          flex-wrap: wrap;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-logo {
          width: 28px;
          height: 28px;
          border-radius: 6px;
        }
        .footer-right {
          text-align: right;
        }
        .footer-right strong {
          color: #5b34c4;
        }
        .footer-right a {
          color: #5b34c4;
          text-decoration: none;
          border-bottom: 1px solid rgba(91, 52, 196, 0.35);
        }
        .footer-right a:hover {
          border-bottom-color: #5b34c4;
        }

        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
          .employer-guide-page {
            padding: 0;
            background: white;
          }
          .guide-container {
            box-shadow: none;
            border-radius: 0;
            padding: 20px;
          }
          .checklist-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .employer-guide-page {
            padding: 16px;
          }
          .guide-container {
            padding: 16px;
          }
          .guide-header {
            flex-direction: column;
          }
          .toolbar {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="guide-container">
        <header className="guide-header">
          <div className="brand-lockup">
            <img
              src={MEDIA.logo}
              alt="millarX Logo"
              className="guide-logo"
            />
            <div>
              <div className="brand-text-main">MILLARX | SME EMPLOYER GUIDE</div>
              <div className="brand-text-sub">Novated Leasing - Transparent - Low Admin</div>
              <div className="contact-strip">
                Contact: <strong>ben@millarx.com.au</strong> - <strong>0492 886 857</strong>
              </div>
            </div>
          </div>
          <div className="toolbar no-print">
            <button className="btn-print" type="button" onClick={handlePrint}>
              Print / Save as PDF
            </button>
          </div>
        </header>

        <h1 className="guide-title">Novated Leasing Support for SME Employers</h1>
        <p className="guide-tagline">
          How millarX makes novated leasing straightforward to administer for small and mid-sized
          businesses - without needing a full salary packaging team.
        </p>

        <div className="mission-box">
          <strong>Our mission at millarX</strong> is to make transparent novated leasing available
          to as many Australian workers as possible. The government concession behind novated leasing
          is designed so everyday Australians can keep more of their salary. Our job is to make sure
          the benefit is clear, fair and easy to access - not buried under complex, opaque pricing.
        </div>

        <section className="guide-card">
          <div className="card-header">
            <div className="card-title">What millarX does for your business</div>
            <span className="pill">Employer support</span>
          </div>
          <p>
            Our role is to remove as much complexity as possible so you can offer novated leasing
            as a genuine employee benefit, without turning it into a second job for your finance or HR team.
          </p>

          <div className="checklist-section">
            <strong>1. Simple employer onboarding</strong>
            <ul>
              <li>Short onboarding discussion to understand your payroll cycles and approval process.</li>
              <li>Set up your company domain (e.g. <em>@yourcompany.com</em>) so only your staff can access DriveIQ.</li>
              <li>Confirm who signs employer novation documentation and how you prefer to receive schedules.</li>
            </ul>
          </div>

          <div className="checklist-section">
            <strong>2. Self-serve quoting for staff</strong>
            <ul>
              <li>Your employees use our DriveIQ portal to build, compare and save their own quotes.</li>
              <li>They can adjust vehicles and terms and see clear "cost to pocket per pay" before making decisions.</li>
              <li>millarX handles finance discussions, applications and documentation directly with the employee.</li>
            </ul>
          </div>

          <div className="checklist-section">
            <strong>3. Clear, lightweight admin for you</strong>
            <ul>
              <li>We provide a simple schedule for payroll with the agreed pre- and post-tax deductions.</li>
              <li>We send standard documentation packs for your authorised signatory (novation agreement etc.).</li>
              <li>We guide you through starters, leavers and changes so you never have to "work it out" alone.</li>
            </ul>
          </div>

          <div className="checklist-section">
            <strong>4. Powered by proven lease management</strong>
            <ul>
              <li>Our back end is powered by <strong>Catch-e</strong>, an industry-leading novated lease management system used across Australia.</li>
              <li>This means your employees get millarX transparency on the front end, backed by a tried-and-tested operational platform in the background.</li>
              <li>You get the reassurance that payments, reconciliations and lease records sit on proven infrastructure, not a home-grown spreadsheet.</li>
            </ul>
          </div>

          <div className="checklist-section highlight">
            <strong>5. Your own Employer Portal</strong>
            <ul>
              <li><strong>Welcome new staff</strong> - send branded novated leasing communications to new employees with a few clicks.</li>
              <li><strong>Existing lease onboarding</strong> - help staff who already have a novated lease with another provider transfer smoothly into your program.</li>
              <li><strong>Cessation support</strong> - manage the end-of-employment process with guided steps for you and your departing employee.</li>
              <li><strong>Engagement dashboard</strong> - see at a glance how many staff are using the benefit and track program activity.</li>
              <li><strong>User guides & resources</strong> - access help documents, FAQs, and step-by-step guides whenever you need them.</li>
              <li><strong>More features coming</strong> - we're continuously improving the portal with new tools over the next six months.</li>
            </ul>
          </div>

          <p className="note">
            For most SMEs, if you can <strong>set up a payroll deduction and pay an invoice</strong>,
            you already have everything you need to run a successful novated leasing program with millarX.
            We handle the specialist pieces.
          </p>
        </section>

        <footer className="guide-footer">
          <div className="footer-left">
            <img
              src={MEDIA.logo}
              alt="millarX"
              className="footer-logo"
            />
            <span>millarX Pty Ltd | ABN 12 345 678 901 | Australian Credit Licence 123456</span>
          </div>
          <div className="footer-right">
            <strong>millarx.com.au</strong> | <a href="mailto:ben@millarx.com.au">ben@millarx.com.au</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
