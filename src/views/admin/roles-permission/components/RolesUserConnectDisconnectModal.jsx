import { apiDeleteConnectEmployee, apiConnectUserEmployee }  from '@/services/AuthRoles'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Notification, toast } from '@/components/ui'
import { HiExclamationTriangle } from 'react-icons/hi2'
import useRolePermissonsUsers from '../hooks/useRolePermissonsUsers'
const RolesUserConnectModal = ({ isOpen, onClose, users }) => {
    const {
        mutate,
    } = useRolePermissonsUsers()
    const onSubmitDisconnect = async () => {
        try {


            await apiDeleteConnectEmployee(users.employeeId,users.id)

            mutate() // Refresh 
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Hủy liên kết  thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi hủy liên kết:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {error.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }
    const onSubmit = async () => {
        try {


            await apiConnectUserEmployee(users.id, users.employeeId)
            mutate() // Refresh 
            onClose()

            toast.push(
                <Notification title="Thành công" type="success">
                    Liên kết thành
                    công!
                </Notification>,
            )
        } catch (error) {
            console.error('Lỗi hủy liên kết:', error)
            toast.push(
                <Notification title="Lỗi" type="danger">
                    Cập nhật thất bại: {error.message || 'Vui lòng thử lại!'}
                </Notification>,
            )
        }
    }
    return (
        <>
        {(!users?.employeeId)&&
        <Dialog
            isOpen={isOpen}
            width={500}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                    <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                </div>

                <h5 className="text-xl font-bold text-gray-900 mb-3">
                    Xác nhận liên kết
                </h5>

                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                    Bạn có chắc chắn muốn 
                    <br />
                    <span className="font-semibold text-red-700 text-lg">
                        "{'  kết nối id của nhân viên và người dùng'}
                       
                        "
                    </span>
                    <br />
                    không?
                    <br />
                    <span className="text-sm text-red-600 font-medium">
                        Hành động này không thể hoàn tác!
                    </span>
                </p>

                <div className="flex justify-center gap-4">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={onClose}
                        className="px-8"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        size="lg"
                        onClick={onSubmit}
                        className="px-8"
                    >
                        Cập nhật
                    </Button>
                </div>
            </div>
        </Dialog>}
        {(users?.employeeId) &&  <Dialog
            isOpen={isOpen}
            width={500}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                    <HiExclamationTriangle className="h-10 w-10 text-red-600" />
                </div>

                <h5 className="text-xl font-bold text-gray-900 mb-3">
                    Xác nhận hủy liên kết
                </h5>

                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                    Bạn có chắc chắn muốn 
                    <br />
                    <span className="font-semibold text-red-700 text-lg">
                    "{' ngừng kết nối id của nhân viên và người dùng'}
                       
                       "
                    </span>
                    <br />
                    không?
                    <br />
                    <span className="text-sm text-red-600 font-medium">
                        Hành động này không thể hoàn tác!
                    </span>
                </p>

                <div className="flex justify-center gap-4">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={onClose}
                        className="px-8"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        size="lg"
                        onClick={onSubmitDisconnect}
                        className="px-8"
                    >
                        Cập nhật
                    </Button>
                </div>
            </div>
        </Dialog>}
        </>
    )
}
export default RolesUserConnectModal

