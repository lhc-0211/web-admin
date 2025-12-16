import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import { useMemo } from 'react'
import { TbEye, TbPencil } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import useAnnouncePrivateList from '../hooks/useAnnouncePrivateList'

// Nếu muốn highlight priority
const priorityColor = {
    Low: 'bg-green-200 text-gray-900',
    Normal: 'bg-blue-200 text-gray-900',
    High: 'bg-yellow-200 text-gray-900',
    Critical: 'bg-red-200 text-gray-900',
}

const ActionColumn = ({ onEdit, onViewDetail }) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className="text-xl cursor-pointer select-none font-semibold"
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const AnnouncePrivateListTable = () => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
    } = useAnnouncePrivateList()

    const columns = useMemo(
        () => [
            {
                header: 'Tiêu đề',
                accessorKey: 'title',
                cell: ({ row }) => row.original.title,
            },
            {
                header: 'Danh mục',
                accessorKey: 'categoryName',
                cell: ({ row }) => row.original.categoryName,
            },
            {
                header: 'Mức độ ưu tiên',
                accessorKey: 'priority',
                cell: ({ row }) => (
                    <Tag className={priorityColor[row.original.priority]}>
                        {row.original.priority}
                    </Tag>
                ),
            },
            {
                header: 'Ngày xuất bản',
                accessorKey: 'publishedAt',
                cell: ({ row }) =>
                    new Date(row.original.publishedAt).toLocaleString(),
            },
            {
                header: 'Công khai',
                accessorKey: 'isPublic',
                cell: ({ row }) => (row.original.isPublic ? 'Có' : 'Không'),
            },
            {
                header: 'Số file',
                accessorKey: 'attachments',
                cell: ({ row }) => row.original.attachments?.length || 0,
            },
        ],
        [],
    )

    const handleSetTableData = (data) => setTableData(data)

    const handlePaginationChange = (page) => {
        handleSetTableData({ ...tableData, pageIndex: page })
    }

    const handleSelectChange = (value) => {
        handleSetTableData({
            ...tableData,
            pageSize: Number(value),
            pageIndex: 1,
        })
    }

    const handleSort = (sort) => {
        handleSetTableData({ ...tableData, sort })
    }

    return (
        <DataTable
            selectable={false} // thông báo không cần chọn hàng
            columns={columns}
            data={customerList}
            noData={!isLoading && customerList.length === 0}
            loading={isLoading}
            pagingData={{
                total: customerListTotal,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    )
}

export default AnnouncePrivateListTable
