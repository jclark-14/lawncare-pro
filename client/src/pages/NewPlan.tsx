import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { ArrowLeft, SquarePlus } from 'lucide-react';

// Main NewPlan component
export function NewPlan() {
  const [formData, setFormData] = useState({
    grassSpecies: '',
    planType: '',
    establishmentType: '',
  });
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  const { user, token } = useUser();

  // Fetch available lawn types
  const fetchAvailableLawnTypes = useCallback(async () => {
    if (!formData.grassSpecies || formData.planType !== 'new_lawn' || !token) {
      return;
    }

    try {
      const response = await fetch(
        `/api/grass-species/${formData.grassSpecies}/plan-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch lawn types');
      }
      const data = await response.json();

      const availableTypes = data
        .filter((item) => item.planType === 'new_lawn')
        .map((item) => item.establishmentType)
        .filter(Boolean);

      setAvailableTypes(availableTypes);
      console.log('Available types:', availableTypes);
    } catch (err) {
      console.error('Error fetching lawn types:', err);
      setError('Failed to load lawn types. Please try again.');
    }
  }, [formData.grassSpecies, formData.planType, token]);

  // Fetch available lawn types when grassSpecies and planType are selected
  useEffect(() => {
    fetchAvailableLawnTypes();
  }, [fetchAvailableLawnTypes]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) {
        console.log('Submission already in progress, ignoring');
        return;
      }
      if (!user) {
        setError('You must be logged in to create a plan');
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/plans/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            grassSpeciesId: formData.grassSpecies,
            planType: formData.planType,
            establishmentType: formData.establishmentType,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create plan');
        }

        const data = await response.json();
        console.log('Plan created successfully:', data);
        navigate(`/plan/${data.userPlanId}`);
      } catch (err) {
        console.error('Error creating plan:', err);
        setError(
          'An error occurred while creating the plan. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user, formData, navigate, isLoading, token]
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const zipcode = localStorage.getItem('zipcode');

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="py-12 sm:pb-20 sm:pt-24 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <BackButton zipcode={zipcode} />
        <PlanForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          availableTypes={availableTypes}
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// Back Button component
function BackButton({ zipcode }) {
  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex justify-center">
        <Link
          to={zipcode ? `/results/${zipcode}` : '/'}
          className="bg-gray-100 text-teal-800 px-6 py-4 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-teal-700 to-teal-600 hover:text-white hover:border-teal-600">
          <ArrowLeft size={20} className="mr-2" />
          {zipcode ? 'Back to Search Results' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}

// Plan Form component
function PlanForm({
  formData,
  handleInputChange,
  handleSubmit,
  availableTypes,
  error,
  isLoading,
}) {
  return (
    <div className="bg-teal-900 bg-opacity-70 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl text-gray-50 sm:text-4xl font-bold text-center tracking-tight mb-8">
        Create a Lawn Plan
      </h2>
      {error && <p className="text-red-500 mb-5 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <SelectField
          id="grassSpecies"
          label="Grass Species"
          value={formData.grassSpecies}
          onChange={handleInputChange}
          options={[
            { value: '1', label: 'Kentucky Bluegrass' },
            { value: '2', label: 'Tall Fescue' },
            { value: '3', label: 'Perennial Ryegrass' },
            { value: '4', label: 'Bermuda' },
            { value: '5', label: 'Zoysia' },
            { value: '6', label: 'St. Augustine' },
            { value: '7', label: 'Centipede' },
            { value: '8', label: 'Fine Fescue' },
            { value: '9', label: 'Buffalo' },
            { value: '10', label: 'Bahia' },
          ]}
        />
        <SelectField
          id="planType"
          label="Plan Type"
          value={formData.planType}
          onChange={handleInputChange}
          options={[
            { value: 'new_lawn', label: 'New Lawn' },
            { value: 'lawn_improvement', label: 'Lawn Improvement' },
          ]}
        />
        {formData.planType === 'new_lawn' && (
          <SelectField
            id="establishmentType"
            label="Lawn Establishment Type"
            value={formData.establishmentType}
            onChange={handleInputChange}
            options={availableTypes.map((type) => ({
              value: type,
              label:
                type === 'sod_plugs'
                  ? 'Sod or Plugs'
                  : type.charAt(0).toUpperCase() + type.slice(1),
            }))}
          />
        )}
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
}

// Select Field component
function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 font-semibold text-gray-50 mt-4">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
        <option value="">Select a {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Submit Button component
function SubmitButton({ isLoading }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-teal-600 border border-solid border-teal-800 bg-opacity-80 text-gray-50 p-3 rounded-full mt-10 transition duration-300 hover:font-semibold hover:bg-gradient-to-r from-teal-800 to-teal-700 hover:border-teal-600 hover:shadow-xl flex items-center justify-center">
      <SquarePlus size={24} className="mr-2" />
      {isLoading ? 'Creating Plan...' : 'Create Plan'}
    </button>
  );
}