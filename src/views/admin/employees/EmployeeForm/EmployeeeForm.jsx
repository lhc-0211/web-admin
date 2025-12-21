import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import ProfileImageSection from './ProfileImageSection'
import InformationOrganizeSection from './InformationOrganizeSection'

import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const validationSchema = z.object({
    id: z.string().uuid().optional(),

    firstName: z.string().min(1, { message: 'Vui lòng nhập tên' }),
    lastName: z.string().min(1, { message: 'Vui lòng nhập họ' }),
    middleName: z.string().optional(),

    email: z
        .string()
        .min(1, { message: 'Vui lòng nhập email' })
        .email({ message: 'Email không hợp lệ' }),

    phoneNumber: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),

    dateOfBirth: z.string().datetime({ message: 'Ngày sinh không hợp lệ' }),

    gender: z.enum(['Male', 'Female', 'Other'], {
        required_error: 'Vui lòng chọn giới tính',
    }),

    applicationUserId: z.string().uuid({ message: 'Người dùng không hợp lệ' }),

    departmentId: z.string().uuid({ message: 'Vui lòng chọn phòng ban' }),

    positionId: z.string().uuid({ message: 'Vui lòng chọn chức vụ' }),

    managerId: z.string().uuid().optional(),

    employmentStatus: z.enum(['Active', 'Inactive', 'Probation', 'Resigned'], {
        required_error: 'Vui lòng chọn trạng thái làm việc',
    }),

    joinDate: z.string().datetime({ message: 'Ngày vào làm không hợp lệ' }),

    probationEndDate: z.string().datetime().optional(),

    leaveDate: z.string().datetime().optional(),

    isActive: z.boolean(),

    address: z.string().min(1, { message: 'Vui lòng nhập địa chỉ' }),

    description: z.string().optional(),

    salary: z.number().min(0, { message: 'Lương phải lớn hơn hoặc bằng 0' }),

    avatarFileId: z.string().uuid().optional(),
})

const EmployeeForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {},
        newCustomer = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            ...{
                banAccount: false,
                accountVerified: true,
            },
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })
    

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} />
                        <InformationOrganizeSection
                            control={control}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                        />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ProfileImageSection
                            control={control}
                            errors={errors}
                        />
                       
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default EmployeeForm
