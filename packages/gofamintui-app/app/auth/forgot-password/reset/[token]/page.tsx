import ResetPasswordComponent from "@/components/resetPasswordComponent";


export default async function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ResetPasswordComponent token={token} />;
}
