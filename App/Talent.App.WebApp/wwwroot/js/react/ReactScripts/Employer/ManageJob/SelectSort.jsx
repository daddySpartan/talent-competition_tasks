import React from 'react'
import { Select } from 'semantic-ui-react'


function SelectSort (props){
    const {handleFilterSelect} = props
     const sortOptions = [
        { key: '4', value: 'Descending', text: 'Newest first' },
        { key: '5', value: 'Ascending', text: 'Oldest first' },


    ]
    
    return (
        <Select placeholder='Newest first' options={sortOptions} onChange={(e, data) => handleFilterSelect(data.value)}/>
     )

}

export default SelectSort