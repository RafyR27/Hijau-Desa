import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";

export default async function Auth({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
  }>;
}) {
  const { success } = await searchParams;

  return <AuthLayout success={success} />;
}
