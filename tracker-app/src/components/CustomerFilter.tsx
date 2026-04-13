'use client'

import { useMemo } from "react";
import Select from "react-select";

export function CustomerFilter({
  customers,
  projects = [],
  category = 'customer',
  resources = [],
  selectedCustomerId,
  onValueChange,
}: {
  customers?: Array<{ id: string; name: string }>
  category?: string
  resources?: Array<{ id: string; name: string; role: string | null; password: string | null }>
  projects?: Array<{ id: string; customerId: string; name: string; schedules: any[]; customer: { id: string, name: string }; resourceId: string }>
  selectedCustomerId?: string
  onValueChange: (value: string) => void
}) {

  const selectOptions = useMemo(() => {
    const allLabel = `All ${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Customers'}`;
    const options = [{ value: 'all', label: allLabel }];

    if (category == null || category === 'customer') {
      customers?.forEach(c => options.push({ value: c.id, label: c.name }));
    } else if (category === 'type') {
      const types = [...new Set(projects.flatMap(p => p.schedules.map(s => s.type)))];
      types.forEach(type => options.push({ value: type, label: type }));
    } else if (category === 'status') {
      const statuses = [...new Set(projects.flatMap(p => p.schedules.map(s => s.status)))];
      statuses.forEach(status => options.push({ value: status, label: status }));
    } else if (category === 'resources') {
      const resourceIds = [...new Set(projects.flatMap(p => p.schedules.flatMap(s => s.resourceId || [])))];
      resourceIds.forEach(id => {
        const r = resources.find(res => res.id === id);
        options.push({ value: id, label: r ? `${r.name} (${r.role})` : id });
      });
    } else if (category === 'role') {
      const roles = [...new Set(resources.map(r => r.role))];
      roles.forEach(role => options.push({ value: role || '', label: role || 'No Role' }));
    }

    return options;
  }, [category, customers, projects, resources]);

  return (
    <div className="text-[12px]">
      {/* <select
        value={selectedCustomerId}
        onChange={(e) => onValueChange(e.target.value)}
        className="cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
      >
        <option value="all">All {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Customers'}</option>
        {(category == null || category === 'customer') && customers && customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        {category === 'type' && [...new Set(projects.flatMap(p => p.schedules.map((s: any) => s.type)))].map(type => <option key={type} value={type}>{type}</option>)}
        {category === 'status' && [...new Set(projects.flatMap(p => p.schedules.map((s: any) => s.status)))].map(status => <option key={status} value={status}>{status}</option>)}
        {category === 'resources' && [...new Set(projects.flatMap(p => p.schedules.flatMap((s: any) => s.resourceId || [])))].map(resourceId => {
          const resource = resources.find(r => r.id === resourceId);
          return <option key={resourceId} value={resourceId}>{resource ? `${resource.name} (${resource.role})` : resourceId}</option>
        })}
        {category === 'role' && [...new Set(resources.map(r => r.role))].map(role => ( <option key={role} value={role ? role : ''}> {role} </option>))}
      </select> */}
      <Select
        id="customerFilter"
        options={selectOptions}
        value={selectOptions.find(opt => opt.value === selectedCustomerId)}
        onChange={(selected) => onValueChange(selected?.value || 'all')}
        isSearchable={true}
        placeholder="Search..."
        className="w-full sm:w-48"
        classNames={{
          control: () => "block w-48 cursor-pointer rounded-md border-gray-300 shadow-sm bg-white",
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '38px', border: '1px solid #d1d5db',
            '&:hover': { borderColor: '#3b82f6' }
          }),
        }}
      />
    </div>
  )
}