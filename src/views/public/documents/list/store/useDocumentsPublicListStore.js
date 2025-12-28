import { create } from 'zustand'

export const initialTableData = {
    pageIndex: 0,
    pageSize: 10,
    query: '', // search
    sort: { order: '', key: '' },
}

export const initialFilterData = {
    CategoryId: '',
    Priority: '',
    Status: '',
    Search: '',
}

const initialState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCustomer: [],
}

export const useDocumentsPublicListStore = create((set) => ({
    ...initialState,
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedCustomer: (checked, row) =>
        set((state) => {
            const prev = state.selectedCustomer
            if (checked) return { selectedCustomer: [...prev, row] }
            return {
                selectedCustomer: prev.filter((c) => c.id !== row.id),
            }
        }),
    setSelectAllCustomer: (rows) => set(() => ({ selectedCustomer: rows })),
}))
