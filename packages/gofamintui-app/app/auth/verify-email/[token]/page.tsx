import VerifyTokenComponent from "../../../../components/auth/verifyTokenComponent";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <VerifyTokenComponent token={token} />;
}
