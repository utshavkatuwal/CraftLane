/* Craftlane — Project create page
 * Form for clients to create a new project. Validates input with Zod and
 * submits to the backend. No fake data is used.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Page } from '@/components/layout/Page';
import { createProject } from '@/features/projects/project.service';
import { toAuthError } from '@/features/auth/auth.service';
import styles from './ProjectCreatePage.module.css';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  project_type: z.enum(['fixed_price', 'hourly']),
  budget_min: z
    .string()
    .optional()
    .refine(
      (val) => val === '' || val === undefined || !isNaN(Number(val)),
      'Budget must be a valid number.',
    ),
  budget_max: z
    .string()
    .optional()
    .refine(
      (val) => val === '' || val === undefined || !isNaN(Number(val)),
      'Budget must be a valid number.',
    ),
  currency: z.string().length(3, 'Currency must be a 3-letter code.'),
  deadline: z.string().optional(),
  skills: z.string().optional(),
});

export function ProjectCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: rfhIsSubmitting },
  } = useForm<{
    title: string;
    description: string;
    project_type: string;
    budget_min: string;
    budget_max: string;
    currency: string;
    deadline: string;
    skills: string;
  }>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      project_type: 'fixed_price',
      budget_min: '',
      budget_max: '',
      currency: 'USD',
      deadline: '',
      skills: '',
    },
  });

  const onSubmit = async (data: {
    title: string;
    description: string;
    project_type: string;
    budget_min: string;
    budget_max: string;
    currency: string;
    deadline: string;
    skills: string;
  }) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await createProject({
        title: data.title,
        description: data.description,
        project_type: data.project_type as 'fixed_price' | 'hourly',
        budget_min: data.budget_min ? Number(data.budget_min) : null,
        budget_max: data.budget_max ? Number(data.budget_max) : null,
        currency: data.currency,
        deadline: data.deadline || undefined,
        skills: data.skills
          ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });
      navigate(`/work`);
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
        <Page className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.title}>Post a project</h2>
              <p className={styles.description}>
                Define your project scope, budget, and timeline to attract
                qualified freelancers.
              </p>
            </div>

            {serverError && (
              <ErrorMessage title="Could not create project" message={serverError} />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <FormField
                id="title"
                label="Project title"
                required
                error={errors.title?.message}
              >
                <Input
                  {...register('title')}
                  placeholder="e.g. Website redesign"
                  autoComplete="off"
                />
              </FormField>

              <FormField
                id="description"
                label="Project description"
                required
                error={errors.description?.message}
              >
                <Input
                  {...register('description')}
                  placeholder="Describe the project scope, deliverables, and requirements."
                  autoComplete="off"
                />
              </FormField>

              <FormField id="project_type" label="Project type" required>
                <select
                  {...register('project_type')}
                  className={styles.select}
                >
                  <option value="fixed_price">Fixed price</option>
                  <option value="hourly">Hourly</option>
                </select>
              </FormField>

              <div className={styles.budgetFields}>
                <FormField
                  id="budget_min"
                  label="Minimum budget"
                  error={errors.budget_min?.message}
                >
                  <Input
                    {...register('budget_min')}
                    type="number"
                    placeholder="e.g. 500"
                    autoComplete="off"
                  />
                </FormField>
                <FormField
                  id="budget_max"
                  label="Maximum budget"
                  error={errors.budget_max?.message}
                >
                  <Input
                    {...register('budget_max')}
                    type="number"
                    placeholder="e.g. 2000"
                    autoComplete="off"
                  />
                </FormField>
              </div>

              <FormField id="currency" label="Currency">
                <Input
                  {...register('currency')}
                  placeholder="USD"
                  autoComplete="off"
                />
              </FormField>

              <FormField id="deadline" label="Deadline (optional)">
                <Input
                  {...register('deadline')}
                  type="datetime-local"
                  autoComplete="off"
                />
              </FormField>

              <FormField id="skills" label="Required skills (comma-separated)">
                <Input
                  {...register('skills')}
                  placeholder="e.g. Design, React, Copywriting"
                  autoComplete="off"
                />
              </FormField>

              <Button
                type="submit"
                size="lg"
                className={styles.submit}
                isLoading={isSubmitting || rfhIsSubmitting}
              >
                Publish project
              </Button>
            </form>

            <p className={styles.dividerText}>
              Browse existing projects?{' '}
              <Link to="/work" className={styles.browseLink}>
                Explore work
              </Link>
            </p>
          </div>
        </Page>
      </main>
      <Footer />
    </div>
  );
}

ProjectCreatePage.displayName = 'ProjectCreatePage';
