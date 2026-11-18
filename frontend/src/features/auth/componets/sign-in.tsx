import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useNavigate, Link } from "react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { useSignin } from "../hooks/use-signin"
import { useGoogleSignin } from "../hooks/use-google-signin"

type SigninValues = {
  email: string
  password: string
}

type SigninErrors = Partial<Record<keyof SigninValues, string>>

const initialValues: SigninValues = {
  email: "",
  password: "",
}

export function SigninForm({ className }: { className?: string }) {
  const navigate = useNavigate()
  const [values, setValues] = useState<SigninValues>(initialValues)
  const [errors, setErrors] = useState<SigninErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const signinMutation = useSignin()
  const googleMutation = useGoogleSignin()

  // Update one field; clear its error as the user types.
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  // Return an errors object; empty object means valid.
  function validate(v: SigninValues): SigninErrors {
    const next: SigninErrors = {}

    if (!v.email.trim()) {
      next.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(v.email)) {
      next.email = "Enter a valid email address"
    }

    if (!v.password) {
      next.password = "Password is required"
    }

    return next
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    signinMutation.mutate(values, {
      onSuccess: () => navigate("/", { replace: true }),
      onError: (error) => setFormError(error.message),
    })
  }

  function handleGoogleSignin() {
    setFormError(null)
    googleMutation.mutate(undefined)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className={className ?? "w-full max-w-sm"}>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your email and password to sign in.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={values.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {(formError || googleMutation.error) && (
              <p className="text-sm text-destructive">
                {formError ?? googleMutation.error?.message}
              </p>
            )}
          </CardContent>

          <CardFooter className="mt-6 flex flex-col gap-3">
            {/* Default variant = bg-primary / text-primary-foreground */}
            <Button type="submit" className="w-full" disabled={signinMutation.isPending || googleMutation.isPending}>
              {signinMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={signinMutation.isPending || googleMutation.isPending}
              onClick={handleGoogleSignin}
            >
              {googleMutation.isPending ? "Connecting..." : "Continue with Google"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}