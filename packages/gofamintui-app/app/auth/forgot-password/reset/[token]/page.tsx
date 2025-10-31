import ResetPasswordComponent from "@/components/auth/resetPasswordComponent";


export default async function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ResetPasswordComponent token={token} />;
}
