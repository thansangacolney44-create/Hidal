import { SignupForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/icons';

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
            <Logo className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-muted-foreground">Join Hifier to start your journey</p>
        </div>
        <SignupForm />
    </div>
  );
}
