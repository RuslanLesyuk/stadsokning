"use client"

import { useMemo, useState } from "react"
import { Input, Select } from "@/components/ui/field"

const STOCKHOLM_LOCATION_OPTIONS = [
  "Stockholm",
  "Solna",
  "Sundbyberg",
  "Nacka",
  "Täby",
  "Danderyd",
  "Sollentuna",
  "Järfälla",
  "Kista",
  "Barkarby",
  "Upplands Väsby",
  "Vallentuna",
  "Åkersberga",
  "Lidingö",
  "Huddinge",
  "Tumba",
  "Botkyrka",
  "Salem",
  "Haninge",
  "Tyresö",
  "Södertälje",
  "Nynäshamn",
  "Norrtälje",
  "Värmdö",
  "Ekerö",
  "Märsta",
] as const

type JobCityFieldProps = {
  label: string
  placeholder: string
  otherLabel: string
  selectOptionLabel: string
  initialCity?: string | null
}

function getInitialValues(city?: string | null) {
  const normalizedCity = String(city || "").trim()

  if (!normalizedCity) {
    return {
      citySelectValue: "",
      cityOtherValue: "",
    }
  }

  if (STOCKHOLM_LOCATION_OPTIONS.includes(normalizedCity as (typeof STOCKHOLM_LOCATION_OPTIONS)[number])) {
    return {
      citySelectValue: normalizedCity,
      cityOtherValue: "",
    }
  }

  return {
    citySelectValue: "other",
    cityOtherValue: normalizedCity,
  }
}

export default function JobCityField({
  label,
  placeholder,
  otherLabel,
  selectOptionLabel,
  initialCity,
}: JobCityFieldProps) {
  const initialValues = useMemo(() => getInitialValues(initialCity), [initialCity])
  const [selectedValue, setSelectedValue] = useState(initialValues.citySelectValue)

  const showOtherField = selectedValue === "other"

  return (
    <>
      <div>
        <Select
          id="city_select"
          name="city_select"
          label={label}
          defaultValue={initialValues.citySelectValue}
          onChange={(event) => setSelectedValue(event.target.value)}
        >
          <option value="">{selectOptionLabel}</option>
          {STOCKHOLM_LOCATION_OPTIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
          <option value="other">{otherLabel}</option>
        </Select>
      </div>

      <div className={showOtherField ? "block" : "hidden"}>
        <Input
          id="city_other"
          name="city_other"
          defaultValue={initialValues.cityOtherValue}
          label={`${otherLabel} (${label})`}
          placeholder={placeholder}
        />
      </div>
    </>
  )
}