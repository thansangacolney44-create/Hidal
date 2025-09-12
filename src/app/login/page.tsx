import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      <LoginForm />
    </div>
  );
}
