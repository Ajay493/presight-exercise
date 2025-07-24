interface FiltersProps {
  selectedHobbies: string[];
  onHobbiesChange: (selected: string[]) => void;
  selectedNationalities: string[];
  onNationalitiesChange: (selected: string[]) => void;
  topHobbies: string[];
  topNationalities: string[];
}

export default function Filters({
  selectedHobbies,
  onHobbiesChange,
  selectedNationalities,
  onNationalitiesChange,
  topHobbies,
  topNationalities,
}: FiltersProps) {
  const handleCheckboxChange = (
    selected: string[],
    setSelected: (selected: string[]) => void,
    value: string,
    isChecked: boolean
  ) => {
    setSelected(
      isChecked ? [...selected, value] : selected.filter(item => item !== value)
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md min-w-[200px]">
      <h3 className="text-lg font-semibold mb-3 text-white">Filter by Hobbies</h3>
      {topHobbies.map(hobby => (
        <div key={hobby} className="mb-2 text-white">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500 rounded"
              checked={selectedHobbies.includes(hobby)}
              onChange={(e) =>
                handleCheckboxChange(selectedHobbies, onHobbiesChange, hobby, e.target.checked)
              }
            />
            <span className="ml-2">{hobby}</span>
          </label>
        </div>
      ))}

      <h3 className="text-lg font-semibold mt-6 mb-3 text-white">Filter by Nationality</h3>
      {topNationalities.map(nationality => (
        <div key={nationality} className="mb-2 text-white">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-blue-500 rounded"
              checked={selectedNationalities.includes(nationality)}
              onChange={(e) =>
                handleCheckboxChange(
                  selectedNationalities,
                  onNationalitiesChange,
                  nationality,
                  e.target.checked
                )
              }
            />
            <span className="ml-2">{nationality}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
