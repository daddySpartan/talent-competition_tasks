import React from 'react'
import { Select } from 'semantic-ui-react'


function SelectFilter (props){
    const {handleFilterSelect} = props
    const filterOptions = [
        { key: '1', value: 'All', text: 'Show all' },
        { key: '2', value: 'Unexpired', text: 'Show Unexpired' },
        { key: '3', value: 'Expired', text: 'Show Expired' },
    ]
    

        return (
           <Select placeholder='Choose filter' options={filterOptions} onChange={(e, data) => handleFilterSelect(data.value)}/>
        )

}

export default SelectFilter