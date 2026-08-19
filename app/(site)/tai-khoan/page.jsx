import { layNguoiDung } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await layNguoiDung();
  if (!user) redirect("/dang-nhap");

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-32">
      <h1 className="font-display text-3xl font-bold text-deep-900">
        Xin chào, {user.name}!
      </h1>
      <pre className="mt-6 overflow-auto rounded-2xl bg-white p-6 text-sm shadow">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}