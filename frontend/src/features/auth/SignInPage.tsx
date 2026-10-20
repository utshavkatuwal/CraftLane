/* Craftlane — Sign in page
 * Accessible sign-in form with Zod validation. Submitting attempts a real API
 * call through the auth service; no session or token is fabricated. Failure is
 * reported honestly.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Link as AppLink } from '@/components/ui/Link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Page } from '@/components/layout/Page';
import { signin, toAuthError } from './auth.service';
import type { SignInForm } from '@/types';
import styles from './SignInPage.module.css';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export function SignInPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: rfhIsSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInForm) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await signin(data);
      // Phase 1 does not manage tokens or sessions, so we do not fabricate a
      // signed-in state. Navigate to the inbox/dashboard honestly once a
      // backend contract exists.
      navigate('/work');
    } catch (error) {
      setServerError(toAuthError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main id="content" className={styles.main}>
        <Page narrow>
          <div className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.title}>Sign in</h2>
              <p className={styles.description}>
                Enter your credentials to access your Craftlane account.
              </p>
            </div>

            {serverError && <ErrorMessage title="Could not sign in" message={serverError} />}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <FormField id="email" label="Email address" required error={errors.email?.message}>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="alex@example.com"
                  autoComplete="email"
                />
              </FormField>

              <FormField id="password" label="Password" required error={errors.password?.message}>
                <div className={styles.passwordWrapper}>
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.toggleVisibility}
                    aria-label="Show password"
                  >
                    <Eye className={styles.icon} aria-hidden="true" />
                  </button>
                </div>
              </FormField>

              <div className={styles.actions}>
                <AppLink href="#" className={styles.recoveryLink}>
                  Forgot password?
                </AppLink>
              </div>

              <Button
                type="submit"
                size="lg"
                className={styles.submit}
                isLoading={isSubmitting || rfhIsSubmitting}
              >
                Sign in
              </Button>
            </form>

            <p className={styles.dividerText}>
              Don't have an account?{' '}
              <Link to="/sign-up" className={styles.signUpLink}>
                Create an account
              </Link>
            </p>
          </div>
        </Page>
      </main>
      <Footer />
    </div>
  );
}

SignInPage.displayName = 'SignInPage';
