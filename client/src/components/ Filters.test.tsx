import { render, screen, fireEvent } from '@testing-library/react'
import Filters from './Filters'
import React from 'react'
import { describe, it, expect, jest } from '@jest/globals'

describe('Filters component', () => {
  const topHobbies = ['Reading', 'Gaming', 'Cooking']
  const topNationalities = ['Indian', 'American', 'French']

  it('renders hobby and nationality checkboxes', () => {
    render(
      <Filters
        selectedHobbies={[]}
        onHobbiesChange={jest.fn()}
        selectedNationalities={[]}
        onNationalitiesChange={jest.fn()}
        topHobbies={topHobbies}
        topNationalities={topNationalities}
      />
    )

    // Check hobby checkboxes rendered
    topHobbies.forEach(hobby => {
      expect(screen.getByLabelText(hobby)).toBeTruthy()
      expect((screen.getByLabelText(hobby) as HTMLInputElement).checked).toBe(false)
    })

    // Check nationality checkboxes rendered
    topNationalities.forEach(nat => {
      expect(screen.getByLabelText(nat)).toBeTruthy()
      expect((screen.getByLabelText(nat) as HTMLInputElement).checked).toBe(false)
    })
  })

  it('calls onHobbiesChange with updated hobbies on checkbox toggle', () => {
    const onHobbiesChange = jest.fn()
    const selectedHobbies = ['Reading']

    render(
      <Filters
        selectedHobbies={selectedHobbies}
        onHobbiesChange={onHobbiesChange}
        selectedNationalities={[]}
        onNationalitiesChange={jest.fn()}
        topHobbies={topHobbies}
        topNationalities={topNationalities}
      />
    )

    // Uncheck 'Reading' hobby
    const readingCheckbox = screen.getByLabelText('Reading')
    fireEvent.click(readingCheckbox)
    expect(onHobbiesChange).toHaveBeenCalledWith([])

    // Check 'Gaming' hobby
    const gamingCheckbox = screen.getByLabelText('Gaming')
    fireEvent.click(gamingCheckbox)
    expect(onHobbiesChange).toHaveBeenCalledWith([...selectedHobbies, 'Gaming'])
  })

  it('calls onNationalitiesChange with updated nationalities on checkbox toggle', () => {
    const onNationalitiesChange = jest.fn()
    const selectedNationalities = ['Indian']

    render(
      <Filters
        selectedHobbies={[]}
        onHobbiesChange={jest.fn()}
        selectedNationalities={selectedNationalities}
        onNationalitiesChange={onNationalitiesChange}
        topHobbies={topHobbies}
        topNationalities={topNationalities}
      />
    )

    // Uncheck 'Indian'
    const indianCheckbox = screen.getByLabelText('Indian')
    fireEvent.click(indianCheckbox)
    expect(onNationalitiesChange).toHaveBeenCalledWith([])

    // Check 'French'
    const frenchCheckbox = screen.getByLabelText('French')
    fireEvent.click(frenchCheckbox)
    expect(onNationalitiesChange).toHaveBeenCalledWith([...selectedNationalities, 'French'])
  })
})
