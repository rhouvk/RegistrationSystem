import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Scanner from "@/Components/Scanner";

export default function DataMatrixScanner() {
  return (
    <AdminLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Scanner</h2>}
    >
      <Head title="Scanner" />
      <div className="p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
          <Scanner />
        </div>
      </div>
    </AdminLayout>
  );
}
