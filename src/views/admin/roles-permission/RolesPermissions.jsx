import Container from '@/components/shared/Container'
import RolesPermissionsGroups from './components/RolesPermissionsGroups'
import RolesPermissionsGroupsAction from './components/RolesPermissionsGroupsAction'
import RolesPermissionsUserAction from './components/RolesPermissionsUserAction'
import RolesPermissionsUserTable from './components/RolesPermissionsUserTable'
import { AdaptiveCard } from '@/components/shared'
const RolesPermissions = () => {

    return (
        <>
            <Container>
            <AdaptiveCard>
                <div className="mb-6 bg-white">
                    <div className="flex items-center justify-between mb-6 ">
                        <h3>Vai Trò & Quyền Hạn </h3>
                        <RolesPermissionsGroupsAction titles="Thêm mới vai trò" />
                    </div>
                    <div className="mb-10">
                        <RolesPermissionsGroups/>
                    </div>
                </div>
                <div>
                    <div>
                        <div className="mb-6 flex flex-col gap-5 bg-white">
                            <h3>Tất cả tài khoản</h3>
                            <div className="flex-1">
                                <RolesPermissionsUserAction />


                            </div>
                        </div>
                        <RolesPermissionsUserTable
                        />
                    </div>
                </div>
                </AdaptiveCard>
            </Container>
           
            {/* <RolesPermissionsUserSelected
                userList={userList}
                userListTotal={userListTotal}
                mutate={userMutate} */}
            {/* /> */}
        </>
    )
}

export default RolesPermissions
