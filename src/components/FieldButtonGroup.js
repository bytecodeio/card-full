import React, { useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

export const FieldButtonGroup = ({fieldGroups, visList, setVisList, handleTabVisUpdate}) => {
    const [selectedFieldGroup, setSelectedFieldGroup] = useState({})

    const handleButtonClick = (el, group) => {
        let _visList = [...visList]
        if (selectedFieldGroup.key === el.target.value) {
            _visList.map(v => {
                let groupList = group['fields'].map(g => g['name'])
                groupList.map(group => {
                    const index = v['selected_fields'].indexOf(group['name'])
                    v['selected_fields'].splice(index,1)
                })
            })
            setSelectedFieldGroup({})
            console.log("visList", _visList)
        } else {
            let _newList = _visList.map(v => {
                if (v.visId == "tabbedVis1") {
                    let groupList = group['fields'].map(g => g['name'])

                    selectedFieldGroup.fields?.map(group => {
                        const index = v['selected_fields'].indexOf(group['name'])
                        v['selected_fields'].splice(index,1)
                    })

                    v['selected_fields'] = v['selected_fields'].concat(groupList)
                }
                console.log("vislist", v)
                return v
            })
            setSelectedFieldGroup({
                key:el.target.value,
                fields:group['fields']
            })
        }
        handleTabVisUpdate(_visList)
    }
    return(
        <>
            <ButtonGroup>            
            {fieldGroups?.map(group => {
                return(
                    <Button className='field-group-button' onClick={(el) => handleButtonClick(el,group)} value={group.label} active={selectedFieldGroup.key == group.label}>{group.label}</Button>
                )
            })}
            </ButtonGroup>
        </>
    )
}