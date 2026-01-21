import { SignUpForm } from "@/components/auth/signup-form"
import Link from "next/link"


function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex items-center gap-2">
            <span>
              Feedback Pulse
            </span>
          </div>
        </Link>
        <SignUpForm />
      </div >
    </div >
  )
}

export default SignupPage

