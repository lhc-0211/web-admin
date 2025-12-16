import { Controller } from 'react-hook-form'
import Select from 'react-select'

const priorities = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
]

const statuses = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Published', value: 'Published' },
    { label: 'Archived', value: 'Archived' },
]

export default function AnnouncePrivateListFilter({ control }) {
    return (
        <div className="flex gap-2">
            {/* Priority Select */}
            <Controller
                name="Priority"
                control={control}
                render={({ field }) => (
                    <Select
                        options={priorities}
                        {...field}
                        placeholder="All Priorities"
                        value={priorities.find(
                            (option) => option.value === field.value,
                        )}
                        onChange={(option) => field.onChange(option?.value)}
                    />
                )}
            />

            {/* Status Select */}
            <Controller
                name="Status"
                control={control}
                render={({ field }) => (
                    <Select
                        options={statuses}
                        {...field}
                        placeholder="All Statuses"
                        value={statuses.find(
                            (option) => option.value === field.value,
                        )}
                        onChange={(option) => field.onChange(option?.value)}
                    />
                )}
            />
        </div>
    )
}
