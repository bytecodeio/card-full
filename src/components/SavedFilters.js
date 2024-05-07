import { ExtensionContext } from "@looker/extension-sdk-react";
import React, { useContext, useEffect, useRef } from "react"
import { useState } from "react";
import { Button, Form, Overlay, OverlayTrigger, Popover, Tooltip, Spinner, Modal } from "react-bootstrap"
import { LoadingComponent } from "./LoadingComponent";
import { v4 as uuidv4 } from 'uuid';
import {Close} from '@styled-icons/material-outlined'
import { Alert, Checkbox, FormControlLabel, Snackbar } from "@mui/material";

export const SavedFilters = ({savedFilters, handleVisUpdate, setSelectedFilters, selectedFilters, removeSavedFilter, upsertSavedFilter}) => {
    const extensionContext = useContext(ExtensionContext)
    const sdk = extensionContext.core40SDK;

    const target = useRef(null);
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState("")
    const [user, setUser] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [filterToDelete, setFilterToDelete] = useState()
    const [savedFiltersObj, setSavedFiltersObj] = useState([])
    const [openMessage, setOpenMessage] = useState(false)

    useEffect(() => {
        const init = async() => {
          let _user = await sdk.me();
          console.log("user",_user)
          setUser(_user.value)
        }
        init();
    },[])

    useEffect(() => {
        console.log("saved filters", savedFilters)
        if (savedFiltersObj?.length !== savedFilters.length ) {            
            setSavedFiltersObj([...savedFilters])
        }
    },[savedFilters])

    const handleSavedFilterClick = async (filter) => {
        setSelectedFilters(filter['filter_string'])
        handleVisUpdate({}, filter['filter_string'])
    }

    const openModal = (id) => {
        setShowModal(true)
        setFilterToDelete(id)
    }

    const handleSavedFilterRemoval = async () => { 
        setShowModal(false)  
        setIsLoading(true)
        //setShowModal(true)     
        await removeSavedFilter(filterToDelete)
        setIsLoading(false)
    }

    const handleNewSavedFilterPopover = () => {        
        setOpen(!open)
    }
    const handleUpdateSavedFilter = (filter) => {        
        setSelectedFilter(filter)
        setOpenEdit(!openEdit)
    }

    return (
        <>
        <div style={{paddingBottom:'30px'}}><span className="allOptions saved-filter-button" ref={target} onClick={handleNewSavedFilterPopover} ><i class="fal fa-plus"></i>   Add</span></div>
        <Overlay target={target.current} show={open} placement="right">
            <div>
                <NewSavedFilterPanel setOpenMessage={setOpenMessage} openMessage={openMessage} selectedFilters={selectedFilters} user={user} setOpen={setOpen} upsertSavedFilter={upsertSavedFilter} setIsLoading={setIsLoading} savedFiltersObj={savedFiltersObj} setSavedFiltersObj={setSavedFiltersObj} />
            </div>
        </Overlay>
        {isLoading?
           <LoadingComponent sz={'sm'} />:
           <>
            {savedFiltersObj?.map(s => {
                    return (
                    <div >
                            <p className="pb-1 saved-filter-item">
                                <div onClick={() => handleSavedFilterClick(s)}>
                                   {s.title} 
                                </div>                                
                                <div className="saved-filter-action">
                                    {s.global == "true"?
                                    <>
                                        <OverlayTrigger
                                            placement="right"
                                            overlay={
                                                <Tooltip>
                                                    This is a global saved filter. Only the original creator can delete or edit this saved filter
                                                </Tooltip>
                                            }
                                            className="tooltipHover"
                                        >
                                        <i className="fal fa-info-circle"></i>
                                        </OverlayTrigger>
                                    </>
                                    :''}
                                    {user.id == s.user_id?
                                    <>
                                        <i onClick={() => handleUpdateSavedFilter(s)}className="far fa-edit"></i>
                                        <i onClick={() => openModal(s.id)} className="fas fa-trash red"></i>
                                    </>
                                    :''}
                                </div>
                            </p>

                    </div>
                    )
                    })}
                    <Overlay target={target.current} show={openEdit} placement="right">
                        <div>
                            <UpdateSavedFilterPanel openEdit={openEdit} setOpenEdit={setOpenEdit} upsertSavedFilter={upsertSavedFilter} selectedFilter={selectedFilter} setIsLoading={setIsLoading} savedFiltersObj={savedFiltersObj} setSavedFiltersObj={setSavedFiltersObj}/>
                        </div>
                    </Overlay>
                    </>
                    }
            <Modal className="clearAllModal" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body><p>Are you sure you want to delete this saved filter?</p></Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleSavedFilterRemoval()}>Delete</Button>
                    <Button className="btn-clear" onClick={() => setShowModal(false)}>Cancel <i class="fas fa-ban stop"></i></Button>
                </Modal.Footer>
            </Modal>
            {/* <Snackbar open={openMessage} onClose={() => setOpenMessage(false)} autoHideDuration={6000} anchorOrigin={{vertical:'top', horizontal:'right'}}>
                <Alert onClose={() => setOpenMessage(false)}
                    severity="success"
                    variant="filled"
                >Saved filter has been saved</Alert>
            </Snackbar> */}
        </>
    )
}

const NewSavedFilterPanel = React.forwardRef(({setOpenMessage, openMessage, setOpen, upsertSavedFilter,setIsLoading, savedFiltersObj, setSavedFiltersObj, user, selectedFilters}) => {
    const [title, setTitle] = useState("");
    const [checkbox, setCheckbox] = useState(false)

    const handleUpdateTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleUpdateCheckbox = (e) => {
        console.log(e)
        setCheckbox(!e)
    }

    const handleCancelClick = () => {
        setTitle("")
        setCheckbox(false);
        setOpen(false)
    }

    const handleSaveClick = async () => {
        setIsLoading(true)
        let newItem = {
            'id':uuidv4(),
            'title':title,
            'global':checkbox,
            'user_id':user.id,
            'filter_string':selectedFilters
        }
        let _savedFilters = [...savedFiltersObj];
        console.log("saved filters",_savedFilters)
        _savedFilters.push(newItem)
        setSavedFiltersObj(_savedFilters) 
        setOpenMessage(true)
        setIsLoading(false)         
        setTitle("")
        setCheckbox(false);   
        await upsertSavedFilter('insert', newItem)
    }

    return (
        <Popover className="saved-filter-popover">
            <Popover.Header className="saved-filter-popover-header"><p>Add Saved Filter</p> <a onClick={handleCancelClick}><i class="fal fa-times"></i></a></Popover.Header>
            <Popover.Body>
                <div className="saved-filter-body">
                    <Form.Label htmlFor="saved-filter-title">Title</Form.Label>
                    <Form.Control onChange={handleUpdateTitle} value={title} id='saved-filter-title'/>

                    <div className="saved-filter-control">
                      <div className="one">
                        {/* <Form.Group>
                        <Form.Check
                        name="saved"
                        onClick={handleUpdateCheckbox}
                        checked={checkbox}
                        type="checkbox"
                        id='saved-filter-check'
                        label="Save as Global Filter"
                        />
                        </Form.Group> */}
                        <FormControlLabel control={<Checkbox />}
                            name="saved"
                            onChange={() => handleUpdateCheckbox(checkbox)}
                            checked={checkbox}
                            type="checkbox"
                            id='saved-filter-check'
                            label="Save as Global Filter">                                
                        </FormControlLabel>
                      </div>
                    </div>


                    <Form.Text className="mt-2 mb-2">*Note: Adding a saved filter will save the current account selections and filter selections</Form.Text>

                    <div className="saved-filter-action-bar">
                        <Button disabled={title.trim() == ""?"disabled":''} onClick={handleSaveClick}>Save</Button>
                        <Button className="btn-clear" onClick={handleCancelClick}>Cancel</Button>
                    </div>
                </div>
                {openMessage?
                <Alert onClose={() => setOpenMessage(false)}
                    severity="success"
                    variant="filled"
                    >Saved filter has been saved</Alert>
                :''}
            </Popover.Body>
        </Popover>
    )
})

const UpdateSavedFilterPanel = React.forwardRef(({setOpenEdit, openEdit, upsertSavedFilter,selectedFilter,setIsLoading,savedFiltersObj,setSavedFiltersObj}) => {
    const [title, setTitle] = useState("");
    const [checkbox, setCheckbox] = useState(false)
    const [id, setId] = useState("")
    const [openMessage, setOpenMessage] = useState(false)

    useEffect(() => {
         console.log("saved", selectedFilter)
         const {global, id, title} = selectedFilter
         setTitle(title)
         let _checkbox = global == "true"?true:false;
         setCheckbox(_checkbox)
         setId(id)
         setOpenMessage(false)
    },[openEdit])

    const handleUpdateTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleUpdateCheckbox = (e) => {
        console.log(e)
        setCheckbox(!e)
    }

    const handleCancelClick = () => {
        setTitle("")
        setCheckbox(false);
        setId("")
        setOpenEdit(false)
    }

    const handleSaveClick = async () => {
        let _savedFilters = [...savedFiltersObj];
        let index = _savedFilters.indexOf(selectedFilter);
        _savedFilters[index].title = title;
        _savedFilters[index].global = checkbox.toString();
        console.log(_savedFilters[index]);
        setSavedFiltersObj(_savedFilters)
        setIsLoading(true)
        upsertSavedFilter('update', {'id':id, 'title':title, 'global':checkbox})
        setIsLoading(false)
        setOpenMessage(true)
    }

    return (
        <Popover className="saved-filter-popover">
            <Popover.Header>Update Saved Filter</Popover.Header>
            <Popover.Body>
                <div className="saved-filter-body">
                    <Form.Label htmlFor="saved-filter-title">Title</Form.Label>
                    <Form.Control onChange={handleUpdateTitle} value={title} id='saved-filter-title'/>

                    <div className="saved-filter-control">

                    <div className="one">
                      {/* <Form.Group>
                      <Form.Check
                      name="saved"
                      onChange={() => handleUpdateCheckbox(checkbox)}
                      checked={checkbox}
                      type="checkbox"
                      id='saved-filter-check'
                      label="Save as Global Filter"
                      />
                      </Form.Group> */}
                        <FormControlLabel control={<Checkbox />}
                            name="saved"
                            onChange={() => handleUpdateCheckbox(checkbox)}
                            checked={checkbox}
                            type="checkbox"
                            id='saved-filter-check'
                            label="Save as Global Filter">                                
                        </FormControlLabel>
                    </div>

        
                    </div>

                    <div>

                    </div>
                    <Form.Text>
                        <div className="saved-filter-update-tooltip">
                            {selectedFilter.tooltip?.map(t => (
                                <p>{t}</p>
                            ))}
                        </div>
                    </Form.Text>

                    <div className="saved-filter-action-bar">
                        <Button disabled={title.trim() == ""?"disabled":''} onClick={handleSaveClick}>Update</Button>
                        <Button className="btn-clear" onClick={handleCancelClick}>Cancel</Button>
                    </div>
                </div>
                {openMessage?
                <Alert onClose={() => setOpenMessage(false)}
                    severity="success"
                    variant="filled"
                    >Saved filter has been updated</Alert>
                :''}

            </Popover.Body>
        </Popover>
    )
})
