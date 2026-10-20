/* Craftlane — Landing page
 * The public home page. Explains the product honestly, with no fabricated
 * testimonials, statistics, customer logos, or example user profiles.
 */

import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Compass,
  FileText,
  Users,
  Clock,
  ShieldCheck,
  Check,
  CalendarDays,
  Wallet,
  Target,
  ListChecks,
  MessageSquareText,
  CircleDollarSign,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Header />
      <main id="content" className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              Early development preview
            </div>
            <h1 className={styles.heading}>
              Real skills.
              <br />
              Clear agreements.
              <br />
              Better work.
            </h1>
            <p className={styles.subheading}>
              Craftlane connects clients with freelancers through transparent project scopes,
              evidence-based portfolios, and structured milestone collaboration — built for trust,
              not hype.
            </p>
            <div className={styles.actions}>
              <Button size="lg" onClick={() => navigate('/sign-up')}>
                Get started
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/work')}>
                Explore work
              </Button>
            </div>
            <p className={styles.note}>
              No account is required to browse. Signing in lets you post projects or submit
              proposals.
            </p>
            <div className={styles.heroBenefits} aria-label="What you can expect">
              <span><Check aria-hidden="true" /> Scope before proposals</span>
              <span><Check aria-hidden="true" /> Milestones agreed upfront</span>
              <span><Check aria-hidden="true" /> Work samples over hype</span>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroCardTopline}>
              <span className={styles.heroCardTag}>A better project brief</span>
              <span className={styles.heroCardStatus}><span /> Ready to review</span>
            </div>
            <div className={styles.heroPanel}>
              <FileText className={styles.icon} aria-hidden="true" />
              <h3>Transparent scopes</h3>
              <p>Every project lists deliverables, timeline, and budget before anyone applies.</p>
              <div className={styles.scopeDivider} />
              <div className={styles.scopeRow}>
                <span><Check aria-hidden="true" /> Defined deliverables</span><b>Included</b>
              </div>
              <div className={styles.scopeRow}>
                <span><CalendarDays aria-hidden="true" /> Timeline</span><b>Agreed first</b>
              </div>
              <div className={styles.scopeRow}>
                <span><Wallet aria-hidden="true" /> Budget</span><b>Visible upfront</b>
              </div>
            </div>
            <p className={styles.heroCardFootnote}>Clear expectations make better collaboration.</p>
          </div>
        </section>

        <section className={styles.section} id="how-it-works">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How it works</h2>
              <p className={styles.sectionDesc}>
                A straightforward hiring flow, the same for every project.
              </p>
            </div>
            <div className={styles.steps}>
              {[
                {
                  number: '01',
                  title: 'Define the scope',
                  body: 'Clients publish a project with clear deliverables, required skills, budget, and timeline.',
                },
                {
                  number: '02',
                  title: 'Review proposals',
                  body: 'Freelancers apply with evidence of relevant work. Clients compare skills and terms side by side.',
                },
                {
                  number: '03',
                  title: 'Agree and start',
                  body: 'Hire a freelancer, confirm milestones, and track delivery against the agreed agreement.',
                },
              ].map((step) => (
                <div key={step.number} className={styles.step}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(styles.section, styles.sectionAlt)} aria-labelledby="brief-title">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>A useful brief, from day one</p>
              <h2 className={styles.sectionTitle} id="brief-title">
                The details that keep work clear
              </h2>
              <p className={styles.sectionDesc}>
                Shared expectations help clients choose confidently and help freelancers decide if
                a project fits.
              </p>
            </div>
            <div className={styles.briefGrid}>
              {[
                {
                  icon: Target,
                  title: 'A clear outcome',
                  body: 'Describe the result you need and the problem the work should solve.',
                },
                {
                  icon: ListChecks,
                  title: 'Defined deliverables',
                  body: 'List the files, features, or other completed work everyone can review.',
                },
                {
                  icon: CircleDollarSign,
                  title: 'Budget and timing',
                  body: 'Share the expected budget and schedule before proposals come in.',
                },
                {
                  icon: MessageSquareText,
                  title: 'Room to clarify',
                  body: 'Discuss requirements and align on milestones before work begins.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <article className={styles.briefCard} key={title}>
                  <div className={styles.briefIcon}>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.twoColumn}>
              <div>
                <h2 className={styles.sectionTitle}>Designed for transparency</h2>
                <ul className={styles.features}>
                  <li>
                    <ShieldCheck className={styles.featureIcon} aria-hidden="true" />
                    <strong>Evidence-based portfolios.</strong> Freelancers show real work samples,
                    not self-reported ratings.
                  </li>
                  <li>
                    <Clock className={styles.featureIcon} aria-hidden="true" />
                    <strong>Milestone collaboration.</strong> Work is broken into agreed
                    deliverables with clear acceptance criteria.
                  </li>
                  <li>
                    <Users className={styles.featureIcon} aria-hidden="true" />
                    <strong>Clear agreements.</strong> Scope, price, and timeline are set before
                    work begins — no surprises.
                  </li>
                </ul>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featurePreview}>
                  <p className={styles.previewLabel}>Illustrative project card</p>
                  <div className={styles.previewLine} />
                  <div className={styles.previewLine} />
                  <div className={styles.previewLineShort} />
                </div>
                <p className={styles.featureCaption}>
                  Project listings show scope and requirements. Any examples you see during
                  development are structural illustrations only — never real users or real
                  marketplace activity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="audience-title">
          <div className={styles.container}>
            <div className={styles.audienceHeader}>
              <p className={styles.eyebrow}>One platform, two perspectives</p>
              <h2 className={styles.sectionTitle} id="audience-title">
                A clearer start for everyone
              </h2>
              <p className={styles.sectionDesc}>
                Good work starts when both sides understand what is expected.
              </p>
            </div>
            <div className={styles.audienceGrid}>
              <article className={styles.audienceCard}>
                <div className={styles.audienceIcon}>
                  <BriefcaseBusiness aria-hidden="true" />
                </div>
                <p className={styles.audienceLabel}>For clients</p>
                <h3 className={styles.audienceTitle}>Get aligned before work begins</h3>
                <p className={styles.audienceBody}>
                  Describe the outcome, set a budget and timeline, then compare proposals against
                  the same brief.
                </p>
                <Link to="/sign-up" className={styles.audienceLink}>
                  Get started <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
              <article className={styles.audienceCard}>
                <div className={styles.audienceIcon}>
                  <Compass aria-hidden="true" />
                </div>
                <p className={styles.audienceLabel}>For freelancers</p>
                <h3 className={styles.audienceTitle}>Choose work with clear terms</h3>
                <p className={styles.audienceBody}>
                  Review project requirements up front and show relevant experience when you apply.
                </p>
                <Link to="/work" className={styles.audienceLink}>
                  Explore projects <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className={cn(styles.section, styles.faqSection)} aria-labelledby="faq-title">
          <div className={cn(styles.container, styles.faqLayout)}>
            <div className={styles.faqIntro}>
              <p className={styles.eyebrow}>A few basics</p>
              <h2 className={styles.sectionTitle} id="faq-title">
                Before you get started
              </h2>
              <p className={styles.sectionDesc}>
                A quick overview of browsing, project briefs, and the current preview.
              </p>
            </div>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>Can I browse projects without an account?</summary>
                <p>You can explore published project listings from Find work without signing in.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>What makes a useful project brief?</summary>
                <p>
                  A clear outcome, deliverables, required skills, budget, and timeline help
                  freelancers understand what the work involves.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary>Are account and project actions live?</summary>
                <p>
                  Craftlane is an early development preview. Account and project interactions are
                  not connected to a backend yet.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={cn(styles.container, styles.cta)}>
            <h2 className={styles.ctaTitle}>Ready to start a project?</h2>
            <p className={styles.ctaDesc}>
              Create a client account to publish your first project, or sign up as a freelancer to
              begin discovering work.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/sign-up">
                <Button size="lg">Create account</Button>
              </Link>
              <Link to="/work">
                <Button variant="outline" size="lg">
                  Browse projects
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
