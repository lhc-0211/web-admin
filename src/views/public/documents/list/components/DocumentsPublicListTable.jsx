import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import { useMemo, useState } from 'react'
import useDocumentsPublicList from '../hooks/useDocumentsPublicList'
import DocumentPublicDetailDrawer from './DocumentPublicDetailDrawer'

const DocumentsPublicListTable = () => {
    const {
        documentsPublicList,
        documentsPublicListTotal,
        tableData,
        isLoading,
        setTableData,
    } = useDocumentsPublicList()

    const [selectedSlug, setSelectedSlug] = useState(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const openDetail = async (document) => {
        if (document.isPublic) {
            setDetailOpen(true)
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Số hiệu văn bản',
                accessorKey: 'documentNumber',
                cell: ({ row }) => (
                    <div
                        className="font-semibold text-primary-600 hover:underline cursor-pointer"
                        onClick={() => openDetail(row.original)}
                    >
                        {row.original.documentNumber || '-'}
                    </div>
                ),
            },
            {
                header: 'Loại văn bản',
                accessorKey: 'documentTypeName',
                cell: ({ row }) => row.original.documentTypeName || '-',
            },
            {
                header: 'Lĩnh vực',
                accessorKey: 'documentCategoryName',
                cell: ({ row }) => row.original.documentCategoryName || '-',
            },
            {
                header: 'Cơ quan ban hành',
                accessorKey: 'issuingAuthorityName',
                cell: ({ row }) => row.original.issuingAuthorityName || '-',
            },
            {
                header: 'Ngày ban hành',
                accessorKey: 'issuedDate',
                cell: ({ row }) =>
                    row.original.issuedDate
                        ? new Date(row.original.issuedDate).toLocaleDateString(
                              'vi-VN',
                          )
                        : '-',
            },
            {
                header: 'Ngày hiệu lực',
                accessorKey: 'effectiveDate',
                cell: ({ row }) =>
                    row.original.effectiveDate
                        ? new Date(
                              row.original.effectiveDate,
                          ).toLocaleDateString('vi-VN')
                        : '-',
            },
            {
                header: 'Trạng thái',
                accessorKey: 'status',
                cell: ({ row }) => (
                    <Tag
                        className={
                            row.original.status === 'Active'
                                ? 'bg-green-200 text-gray-900'
                                : 'bg-gray-200 text-gray-700'
                        }
                    >
                        {row.original.status === 'Active'
                            ? 'Có hiệu lực'
                            : 'Hết hiệu lực'}
                    </Tag>
                ),
            },
            {
                header: 'Công khai',
                accessorKey: 'isPublic',
                cell: ({ row }) => (row.original.isPublic ? 'Có' : 'Không'),
            },
            {
                header: 'Lượt xem',
                accessorKey: 'viewCount',
                cell: ({ row }) => {
                    const views = row.original.viewCount ?? 0
                    return (
                        <div className="font-medium">
                            {views.toLocaleString('vi-VN')} lượt
                        </div>
                    )
                },
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
        <>
            <DataTable
                selectable={false}
                columns={columns}
                data={documentsPublicList}
                noData={!isLoading && documentsPublicList.length === 0}
                loading={isLoading}
                pagingData={{
                    total: documentsPublicListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />

            <DocumentPublicDetailDrawer
                isOpen={detailOpen}
                onClose={() => {
                    setDetailOpen(false)
                    setSelectedSlug(null)
                }}
                documentSlug={selectedSlug}
            />
        </>
    )
}

export default DocumentsPublicListTable
