import { create } from 'zustand'

export const initialTableData = {
    pageIndex: 0,
    pageSize: 10,
    sort: { key: '', order: '' },
}

export const initialFilterData = {
    Search: '',
}

const useFeaturedStore = create((set) => ({
    // State ban đầu
    tableData: initialTableData,
    filterData: initialFilterData,

    // Actions
    setTableData: (payload) => set({ tableData: payload }),

    setFilterData: (payload) =>
        set((state) => ({
            filterData: { ...state.filterData, ...payload },
        })),
}))

export { useFeaturedStore }
