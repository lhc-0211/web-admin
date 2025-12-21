import useEmployeeList from '../hooks/useEmployeeList'
import CustomerListSearch from './EmployeeListSearch'
import CustomerTableFilter from './EmployeeListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const EmployeeListTableTools = () => {
    const { tableData, setTableData } = useEmployeeList()

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CustomerListSearch onInputChange={handleInputChange} />
            <CustomerTableFilter />
        </div>
    )
}

export default EmployeeListTableTools
