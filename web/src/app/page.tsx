import Link from "next/link";

import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex h-full w-full flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Simpli-Fi</h1>
      <h3 className="text-xl font-bold tracking-tight">
        The simplest finance app for all your group transactions.
      </h3>
    </div>
  );
}
