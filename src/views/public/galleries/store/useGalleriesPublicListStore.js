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

export const useGalleriesPublicListStore = create((set) => ({
    ...initialState,
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    resetFilterData: () =>
        set(() => ({
            filterData: initialFilterData,
        })),
}))
