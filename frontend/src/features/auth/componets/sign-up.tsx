import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router"
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
import { useSignup } from "../hooks/use-signup"
import { useGoogleSignin } from "../hooks/use-google-signin"

type SignupValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type SignupErrors = Partial<Record<keyof SignupValues, string>>

const initialValues: SignupValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export function SignupForm({ className }: { className?: string }) {
  const navigate = useNavigate()
  const [values, setValues] = useState<SignupValues>(initialValues)
  const [errors, setErrors] = useState<SignupErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const signupMutation = useSignup()
  const googleMutation = useGoogleSignin()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validate(v: SignupValues): SignupErrors {
    const next: SignupErrors = {}

    if (!v.name.trim()) next.name = "Name is required"

    if (!v.email.trim()) {
      next.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(v.email)) {
      next.email = "Enter a valid email address"
    }

    if (!v.password) {
      next.password = "Password is required"
    } else if (v.password.length < 8) {
      next.password = "Password must be at least 8 characters"
    }

    if (!v.confirmPassword) {
      next.confirmPassword = "Please confirm your password"
    } else if (v.confirmPassword !== v.password) {
      next.confirmPassword = "Passwords do not match"
    }

    return next
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    signupMutation.mutate(
      { name: values.name.trim(), email: values.email.trim(), password: values.password },
      {
        onSuccess: () => navigate("/", { replace: true }),
        onError: (error) => setFormError(error.message),
      },
    )
  }

  function handleGoogleSignin() {
    setFormError(null)
    googleMutation.mutate(undefined)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className={className ?? "w-full max-w-sm"}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details below to get started.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="Your name" value={values.name} onChange={handleChange} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" value={values.email} onChange={handleChange} />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={values.password} onChange={handleChange} />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            {(formError || googleMutation.error) && (
              <p className="text-sm text-destructive">{formError ?? googleMutation.error?.message}</p>
            )}
          </CardContent>

          <CardFooter className="mt-6 flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={signupMutation.isPending || googleMutation.isPending}>
              {signupMutation.isPending ? "Creating account..." : "Sign up"}
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled={signupMutation.isPending || googleMutation.isPending} onClick={handleGoogleSignin}>
              {googleMutation.isPending ? "Connecting..." : "Continue with Google"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/sign-in" className="text-primary underline-offset-4 hover:underline">
                Log in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}