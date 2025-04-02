import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ActionCard from '../components/ActionCard';
import TrainerForm from '../components/TrainerForm';
import axios from 'axios';

const Trainers: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Log the form data being sent
      console.log('Submitting form data:', formData);

      // Create FormData object for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'resume' && formData[key]) {
          submitData.append('resume', formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Log the FormData contents
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post('http://localhost:5000/api/trainers', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      setSuccess('Trainer added successfully!');
      setIsFormOpen(false);
      
      console.log('Trainer created:', response.data);
    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Failed to add trainer. Please try again.';
      
      if (err.response?.status === 400) {
        if (err.response?.data?.message === 'User with this email already exists') {
          errorMessage = 'A trainer with this email address already exists. Please use a different email.';
        } else if (err.response?.data?.errors) {
          errorMessage = err.response.data.errors.map((error: any) => error.msg).join(', ');
        } else {
          errorMessage = err.response?.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trainers</h1>
        <div onClick={() => setIsFormOpen(true)}>
          <ActionCard 
            icon={<Plus size={24} />} 
            title="Add New Trainer" 
            description="Create trainer profile" 
          />
        </div>
      </div>
      <p className="text-gray-500">Manage your training staff here.</p>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <TrainerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setError(null);
          setSuccess(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Trainers;
