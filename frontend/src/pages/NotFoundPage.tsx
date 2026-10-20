/* Craftlane — NotFound page
 * Branded 404 with a clear route back to a relevant destination.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Link as ExternalLink } from '@/components/ui/Link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Page } from '@/components/layout/Page';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="content" className={styles.main}>
        <Page narrow>
          <div className={styles.notFound}>
            <div className={styles.status}>404</div>
            <h1 className={styles.heading}>Page not found</h1>
            <p className={styles.description}>
              The page you're looking for doesn't exist. It may have been moved or the link may be
              outdated.
            </p>
            <div className={styles.actions}>
              <Link to="/">
                <Button>Return home</Button>
              </Link>
              <Link to="/work">
                <Button variant="outline">Explore work</Button>
              </Link>
            </div>
            <p className={styles.note}>
              Having trouble?{' '}
              <ExternalLink href="mailto:support@example.craftlane.test">Contact us</ExternalLink>
            </p>
          </div>
        </Page>
      </main>
      <Footer />
    </div>
  );
}
