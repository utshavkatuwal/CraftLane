/* Craftlane — Sign up page
 * Accessible registration form with Zod validation. Submitting attempts a real
 * API call through the auth service; no fake account or session is ever
 * created. Success and failure are both reported honestly.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm, type UseFormRegister } from 'react-hook-form';
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
import { signup, toAuthError } from './auth.service';
import type { SignUpForm } from '@/types';
import styles from './SignUpPage.module.css';

const schema = z
  .object({
    full_name: z.string().min(2, 'Please enter your full name.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(128, 'Password is too long.'),
    password_confirm: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms and privacy policy.' }),
    }),
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ['password_confirm'],
    message: 'Passwords do not match.',
  });

export function SignUpPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: rfhIsSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      password_confirm: '',
      terms: false,
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await signup(data);
      // A real backend would issue a session here. Phase 1 does not manage
      // tokens, so we do not fabricate a signed-in state. Navigate honestly.
      navigate('/sign-in', { state: { email: data.email } });
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
              <h2 className={styles.title}>Create an account</h2>
              <p className={styles.description}>
                Join Craftlane as a client or freelancer. No credit card required.
              </p>
            </div>

            {serverError && <ErrorMessage title="Could not create account" message={serverError} />}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <FormField
                id="full_name"
                label="Full name"
                required
                error={errors.full_name?.message}
              >
                <Input
                  {...register('full_name')}
                  placeholder="e.g. Alex Rivera"
                  autoComplete="name"
                />
              </FormField>

              <FormField id="email" label="Email address" required error={errors.email?.message}>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="alex@example.com"
                  autoComplete="email"
                />
              </FormField>

              <FormField id="password" label="Password" required error={errors.password?.message}>
                <PasswordInput
                  register={register}
                  field="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </FormField>

              <FormField
                id="password_confirm"
                label="Confirm password"
                required
                error={errors.password_confirm?.message}
              >
                <PasswordInput
                  register={register}
                  field="password_confirm"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </FormField>

              <div className={styles.termsField}>
                <input
                  id="terms"
                  {...register('terms')}
                  type="checkbox"
                  className={styles.checkbox}
                  required
                />
                <label htmlFor="terms" className={styles.termsLabel}>
                  I agree to the{' '}
                  <AppLink href="#" className={styles.termsLink}>
                    Terms of service
                  </AppLink>
                  and{' '}
                  <AppLink href="#" className={styles.termsLink}>
                    Privacy policy
                  </AppLink>
                  .
                </label>
                {errors.terms && <span className={styles.errorText}>{errors.terms.message}</span>}
              </div>

              <Button
                type="submit"
                size="lg"
                className={styles.submit}
                isLoading={isSubmitting || rfhIsSubmitting}
              >
                Create account
              </Button>
            </form>

            <p className={styles.dividerText}>
              Already have an account?{' '}
              <Link to="/sign-in" className={styles.signInLink}>
                Sign in
              </Link>
            </p>
          </div>
        </Page>
      </main>
      <Footer />
    </div>
  );
}

interface PasswordInputProps {
  register: UseFormRegister<SignUpForm>;
  field: 'password' | 'password_confirm';
  placeholder?: string;
  autoComplete?: string;
}

function PasswordInput({ register, field, placeholder, autoComplete }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.passwordWrapper}>
      <Input
        {...(register(field) as Record<string, unknown>)}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={styles.toggleVisibility}
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
      </button>
    </div>
  );
}

SignUpPage.displayName = 'SignUpPage';
