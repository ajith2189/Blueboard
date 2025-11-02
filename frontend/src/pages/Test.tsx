import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/ui/Pagination";
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
      <Button variant={"destructive"}>destructive</Button>
      <Button variant={"secondary"}>second</Button>
      <Button variant={"ghost"}>ghost</Button>
      <Button variant={"link"}>link</Button>
      <Button variant={"admin"}>admin</Button>
      <Button >
      </Button>
      <Spinner />
      </div>
      <LoadingSpinner className="size-8" />
       <Pagination
        currentPage={1}
        totalPages={2}
        onPageChange={() =>{}}
      />
    </>
    );
}
  

