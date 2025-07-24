import type { Person } from '../types/person'

type Props = {
  person: Person
}

const PersonCard = ({
  person: { avatar, first_name, last_name, age, nationality, hobbies },
}: Props) => {
  const topHobbies = hobbies.slice(0, 2)
  const remainingHobbiesCount = hobbies.length - 2
  const fullName = `${first_name} ${last_name}`

  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-300 bg-white p-4 shadow transition-all hover:shadow-md">
      <img
        src={avatar}
        alt={fullName}
        className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">
          <strong>{fullName}</strong>
        </h3>
        <p className="text-sm text-gray-500">{`${nationality}, Age ${age}`}</p>
        <p className="mt-2 text-sm text-gray-700">
          Hobbies:{' '}
          {topHobbies.length > 0 ? topHobbies.join(', ') : 'None'}
          {remainingHobbiesCount > 0 ? ` +${remainingHobbiesCount}` : ''}
        </p>
      </div>
    </div>
  )
}

export default PersonCard
