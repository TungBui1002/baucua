import { useState, useEffect } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BauCuaGame } from "./BauCuaGame";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-900 via-red-800 to-yellow-800">
      <header className="sticky top-0 z-10 bg-red-900/90 backdrop-blur-sm h-16 flex justify-between items-center border-b border-yellow-600 shadow-lg px-4">
        <h2 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
          🎲 Bầu Cua Tôm Cá
        </h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 p-4">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        <BauCuaGame />
      </Authenticated>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-yellow-300 mb-4 drop-shadow-lg">
              🎲 Bầu Cua Tôm Cá 🎲
            </h1>
            <p className="text-xl text-yellow-100 mb-4">
              Trò chơi dân gian Việt Nam truyền thống
            </p>
            <p className="text-lg text-yellow-200 mb-8">
              💰 Hết tiền? Liên hệ anh Tùng để nạp thêm!
            </p>
          </div>
          <div className="w-full max-w-md">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
