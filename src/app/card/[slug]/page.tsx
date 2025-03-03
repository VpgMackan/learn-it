export default async function SetId({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="">
      <h1>Test {slug}</h1>
    </div>
  );
}
