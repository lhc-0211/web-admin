import { create } from 'zustand'

export const initialTableData = {
    pageIndex: 1,        // map -> pageNumber
    pageSize: 10,        // map -> pageSize
    search: '',          // map -> search
    sortBy: '',          // map -> sortBy
    sortDirection: '',   // asc | desc
}


export const initialFilterData = {
    departmentId: null,
    positionId: null,
    managerId: null,
    employmentStatus: null, // Active | OnLeave | ...
    isActive: null,         // true | false | null
    fromJoinDate: null,     // ISO string
    toJoinDate: null,       // ISO string
}


const initialState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedEmployee: [],
}

export const useEmployeeListStore = create((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedEmployee: (checked, row) =>
        set((state) => {
            const prevData = state.selectedEmployee
            if (checked) {
                return { selectedEmployee: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevEmployee) => row.id === prevEmployee.id)
                ) {
                    return {
                        selectedEmployee: prevData.filter(
                            (prevEmployee) => prevEmployee.id !== row.id,
                        ),
                    }
                }
                return {selectedEmployee: prevData }
            }
        }),
    setSelectAllEmployee: (row) => set(() => ({ selectedEmployee: row })),
}))
