"use client";

import { useState } from "react";
import {Card} from "./Card";
import {EditCustomerForm} from "./EditCustomerForm";

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
      <div className="overflow-auto h-[65vh]">
        {filtered.map(c => (
        <Card key={c.id} title={c.name}>
          <EditCustomerForm customer={c} />
        </Card>
      ))}
      </div>
      {/* {filtered.length === 0 && 
        <div className="p-8 text-center bg-white rounded-lg border border-gray-200 text-gray-500">
          No customers found.
        </div>
      } */}
    </div>
  );
}
