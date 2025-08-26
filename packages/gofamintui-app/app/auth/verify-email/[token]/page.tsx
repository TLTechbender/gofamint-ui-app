import VerifyTokenComponent from "../../../../components/auth/verifyTokenComponent";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  console.log(token);
  return <VerifyTokenComponent token={token} />;
}
