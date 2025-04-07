import GameArea from "@/components/GameArea";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center w-screen">
      <GameArea />
    </main>
  );
}
