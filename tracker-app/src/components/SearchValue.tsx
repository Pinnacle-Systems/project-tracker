"use client";

import { useState } from "react";
import { EditCustomerForm } from "./EditCustomerForm";

export default function SearchValue({ data }: { data: any[] }) {

  const [searchTerm, setSearchTerm] = useState("");
  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search customers..."
        className="block w-full rounded-md text-sm border border-gray-300 p-[5px]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {
        filtered.length == 0 && 
        <div className="border border-gray-300 rounded-lg text-sm text-gray-500 text-center py-4">
          No Customer found for your search
        </div>
      }
      {
        filtered && filtered.length > 0 &&
        <div className="overflow-auto h-[65vh]">
          <div className="grid md:grid-cols-3 gap-2">
            {filtered.map(c => (
              <EditCustomerForm key={c.id} customer={c} />
            ))}
          </div>
        </div>
      }
    </div>
  );
}