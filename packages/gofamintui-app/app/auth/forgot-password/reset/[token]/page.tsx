import ResetPasswordCompoent from "@/components/resetPasswordComponent";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ResetPasswordCompoent token={token} />;
}
