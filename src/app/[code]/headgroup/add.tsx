import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

const AddHeadGroup = () => {
  const [formData, setFormData] = useState({
    head: '',
    groupName: '',
    subgroupName: '',
    description: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to save the form data to the database
    router.push('/[code]/headgroup');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Head Group</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="head"
          placeholder="Head"
          value={formData.head}
          onChange={handleChange}
          className="block mb-2"
        />
        <input
          type="text"
          name="groupName"
          placeholder="Group Name"
          value={formData.groupName}
          onChange={handleChange}
          className="block mb-2"
        />
        <input
          type="text"
          name="subgroupName"
          placeholder="Subgroup Name"
          value={formData.subgroupName}
          onChange={handleChange}
          className="block mb-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="block mb-2"
        />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

export default AddHeadGroup;
