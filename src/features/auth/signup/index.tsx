import { AuthLayout } from "../components/AuthLayout";
import { SignupForm } from "../components/SignUpForm";

export function SignupPage() {
    return (
        <AuthLayout>
            <SignupForm />
        </AuthLayout>
    );
}