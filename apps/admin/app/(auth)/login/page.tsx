import { LoginForm } from "@/components/auth/login-form";
import { getAllOrders } from "@/lib/fetch/order.data";

export default async function LoginPage() {
  const res = await getAllOrders({});
  console.log(res);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
