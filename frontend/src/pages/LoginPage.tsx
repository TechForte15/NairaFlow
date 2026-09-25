import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

type LoginPageProps = {
  onShowRegister: () => void
}

type LoginErrors = {
  email?: string
  password?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage({ onShowRegister }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Enter your email address.'
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password) {
      nextErrors.password = 'Enter your password.'
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email, password })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to log in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-card" aria-labelledby="login-heading">
        <div className="auth-heading">
          <p className="brand">NairaFlow</p>
          <h1 id="login-heading" className="heading-2">
            Welcome back
          </h1>
          <p className="body-text">Log in to continue to your wallet.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="message message--error" role="alert">
              {formError}
            </p>
          )}

          <div>
            <label className="label" htmlFor="login-email">
              Email address
            </label>
            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email && (
              <p id="login-email-error" className="field-error">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            {errors.password && (
              <p id="login-password-error" className="field-error">
                {errors.password}
              </p>
            )}
          </div>

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer body-text">
          New to NairaFlow?{' '}
          <button className="auth-link" type="button" onClick={onShowRegister}>
            Create an account
          </button>
        </p>
      </section>
    </main>
  )
}
