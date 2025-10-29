import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function TestPage() {
  return (
    <>
      {/* // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500"> */}
      <div>
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🚀 Tailwind is Working!
        </h1>
        <p className="text-gray-600 mb-6">
          If you see gradient background, centered white box, and styled text —
          Tailwind setup is correct 🎉
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
          Test Button
        </button>
      </div>
      <Button>ahel</Button>
      <Button variant={"destructive"}>ahel</Button>
      <Button variant={"secondary"}>ahel</Button>
      <Button variant={"ghost"}>ahel</Button>
      <Button variant={"link"}>ahel</Button>
      <Button variant={"admin"}>ahel</Button>
      <Button >
      </Button>
      <Spinner />
      </div>
      <Spinner className="size-8" />
    </>
    );
}
  

