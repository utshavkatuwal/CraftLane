/* Craftlane — Landing page
 * The public home page. Explains the product honestly, with no fabricated
 * testimonials, statistics, customer logos, or example user profiles.
 */

import { Link, useNavigate } from 'react-router-dom';
import { FileText, Users, Clock, ShieldCheck } from 'lucide-react';
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
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroPanel}>
              <FileText className={styles.icon} aria-hidden="true" />
              <h3>Transparent scopes</h3>
              <p>Every project lists deliverables, timeline, and budget before anyone applies.</p>
            </div>
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

        <section className={cn(styles.section, styles.sectionAlt)}>
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
