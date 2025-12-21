import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const genderOptions = [
    { value: 'Male', label: 'Nam' },
    { value: 'Female', label: 'Nữ' },
    { value: 'Other', label: 'Khác' },
]

const OverviewSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Thông tin cá nhân</h4>
            <div className=' space-y-4'>
            <div className="grid md:grid-cols-3 gap-4 ">
                <FormItem
                    label="Họ"
                    invalid={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nhập họ"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Tên"
                    invalid={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nhập tên"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Tên đệm"
                    invalid={Boolean(errors.middleName)}
                    errorMessage={errors.middleName?.message}
                >
                    <Controller
                        name="middleName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nhập tên đệm"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Nhập email"
                            {...field}
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Số điện thoại"
                invalid={Boolean(errors.phoneNumber)}
                errorMessage={errors.phoneNumber?.message}
            >
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Nhập số điện thoại"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Ngày sinh"
                invalid={Boolean(errors.dateOfBirth)}
                errorMessage={errors.dateOfBirth?.message}
            >
                <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            placeholder="Chọn ngày sinh"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) =>
                                field.onChange(date?.toISOString() ?? '')
                            }
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Giới tính"
                invalid={Boolean(errors.gender)}
                errorMessage={errors.gender?.message}
            >
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <Select
                            placeholder="Chọn giới tính"
                            options={genderOptions}
                            value={genderOptions.find(
                                (opt) => opt.value === field.value,
                            )}
                            onChange={(option) =>
                                field.onChange(option?.value ?? '')
                            }
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Địa chỉ"
                invalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Nhập địa chỉ"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
