import { create } from 'zustand'

export const initialTableData = {
    pageIndex: 0,
    pageSize: 10,
    sort: { key: '', order: '' },
}

export const initialFilterData = {
    Search: '',
    CategoryId: '',
    TagIds: [],
    Status: '',
}

const useNewsStore = create((set) => ({
    // State ban đầu
    tableData: initialTableData,
    filterData: initialFilterData,

    // Actions
    setTableData: (payload) => set({ tableData: payload }),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    resetFilterData: () =>
        set(() => ({
            filterData: initialFilterData,
        })),
}))

export { useNewsStore }
