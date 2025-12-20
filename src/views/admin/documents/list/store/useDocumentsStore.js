import { create } from 'zustand'

export const initialTableData = {
    pageIndex: 0,
    pageSize: 10,
    sort: { key: '', order: '' },
}

export const initialFilterData = {
    Search: '',
}

const useDocumentsStore = create((set) => ({
    // State ban đầu
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedViolation: [],

    // Actions
    setTableData: (payload) => set({ tableData: payload }),

    setFilterData: (payload) =>
        set((state) => ({
            filterData: { ...state.filterData, ...payload },
        })),

    // Xử lý chọn từng hàng (checkbox)
    setSelectedViolation: (checked, row) =>
        set((state) => {
            const prev = state.selectedViolation
            if (checked) {
                return { selectedViolation: [...prev, row] }
            }
            return {
                selectedViolation: prev.filter((item) => item.id !== row.id),
            }
        }),

    // Chọn tất cả hàng trên trang hiện tại
    setSelectAllViolation: (rows) => set({ selectedViolation: rows }),
}))

export { useDocumentsStore }
