import React from 'react'
import { useState, useRef, useContext } from 'react';
import { Overlay, Popover, Form, PopoverHeader, PopoverContent, Button } from 'react-bootstrap';
import { ExtensionContext } from '@looker/extension-sdk-react';
import { useEffect } from 'react';
import { LoadingComponent } from './LoadingComponent';

export const EmbedActionBar = ({ slideIt3, showMenu3, setShowMenu3, active, setActive, handleClick, faClass, toggle, setToggle, setFaClass, queryId, title, vizType}) => {
    const extensionContext = useContext(ExtensionContext);
    const sdk = extensionContext.core40SDK;

    const downloadTypes = [
        {label:'Excel (.xslx)','type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', value:'xlsx'},
        {label:'Comma-separated values (.csv)','type':'text/csv', value:'csv'},
        {label:'Text (.txt)','type':'text/plain', value:'txt'},
        {label:'Image (.jpg)','type':'image/jpg', value:'jpg'},
        {label:'Image (.png)','type':'image/png', value:'png'},
        {label:'JSON','type':'application/json', value:'json'},
    ]

    const printTypes = [
        {label:'Image (.jpg)','type':'image/jpg', value:'jpg'},
        {label:'Image (.png)','type':'image/png', value:'png'}
    ]

    const printTarget = useRef(null);
    const downloadTarget = useRef(null);
    const [openDownload, setOpenDownload] = useState(false)
    const [openPrint, setOpenPrint] = useState(false)
    const [type, setType] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleDownloadPopover = () => {
        setType({})
        setOpenPrint(false)
        setOpenDownload(!openDownload)
    }

    const handlePrintPopover = () => {
        setType({})
        setOpenDownload(false);
        setOpenPrint(!openPrint)
    }

    const handleDownload = async () => {
        setIsLoading(true)
        let _type = {...type}
        let res;
        if (_type.value == 'jpg' || _type.value == 'png') {
            let renderLoaded = false;
            const {id} = await sdk.ok(sdk.create_query_render_task(queryId,_type.value,1600,800));
            do {
                console.log('checking')
                let {status} = await sdk.ok(sdk.render_task(id));
                if (status === "success") {
                    console.log('success')
                    res = await sdk.ok(sdk.render_task_results(id))
                    renderLoaded = true;
                }
            } while (renderLoaded==false)
        } else {
            const {id} = await sdk.ok(sdk.query_for_slug(queryId));
            res = await sdk.ok(sdk.run_query({query_id:id, result_format:_type.value, limit:5000}));
        }
        downloadFile(res,_type)
        setIsLoading(false)
    }

    const handlePrint = async () => { 
        let {hostUrl, hostType, extensionId} = extensionContext.extensionSDK.lookerHostData;
        let _hostType = hostType == "spartan"?"spartan":"extensions";
        let url = `${hostUrl}/${_hostType}/${extensionId}/print?qid=${queryId}&type=${type.value}`
        extensionContext.extensionSDK.openBrowserWindow(url)
    }

    const downloadFile = (file, _type) => {
        const el = document.createElement("a");
        const _file =  new Blob([file], {type:_type.type});
        el.href = window.URL.createObjectURL(_file);
        el.download = `${title}.${_type.value}`;
        document.body.appendChild(el)
        el.click()
        document.body.removeChild(el)
    }

    useEffect(() => {
        setOpenPrint(false)
        setOpenDownload(false)
    },[active])


    return (
        <>
        <div className={showMenu3?"embed-icon-container expand":"embed-icon-container"} >
            <p className='embed-action-title'>{vizType=="single"?title:''}</p>
            <div className='embed-icons-right'>
                <i class="fal fa-download embed-icon"  onClick={handleDownloadPopover} ref={downloadTarget}></i>
                <i class="fal fa-print embed-icon" onClick={handlePrintPopover} ref={printTarget}></i>
                <p className="small embed-icon" onClick={() => {slideIt3();handleClick()}}>
                <i className={faClass ? 'fal fa-expand-alt' : 'far fa-compress-arrows-alt'}></i> { active ? "Collapse" : "Expand"}</p>
            </div>
        </div>
        <Overlay target={downloadTarget.current} show={openDownload} placement="bottom">
            <Popover>
                <Popover.Header className='vis-download-header'>
                    Download
                    <i class="fal fa-times export-item" onClick={() => setOpenDownload(false)} ></i>
                </Popover.Header>
                <Popover.Body>
                    <Form.Group style={{position:'relative'}}>
                        {isLoading?<LoadingComponent style={{opacity:'60%'}}/>:''}
                        <div className='vis-download-container'>
                            {downloadTypes?.map(t => (
                                <Form.Check
                                    type="radio"
                                    label={t.label}
                                    checked={type.value === t.value}
                                    onClick={() => setType(t)}
                                />
                            ))}
                        </div>
                        <Button onClick={handleDownload}>Download</Button>
                    </Form.Group>
                </Popover.Body>
            </Popover>
        </Overlay>
        <Overlay target={printTarget.current} show={openPrint} placement="bottom">
            <Popover>
                <Popover.Header className='vis-download-header'>
                    Print
                    <i class="fal fa-times export-item" onClick={() => setOpenPrint(false)} ></i>
                </Popover.Header>
                <Popover.Body>
                    <Form.Group>
                        <div className='vis-download-container'>
                            {printTypes?.map(t => (
                                <Form.Check
                                    type="radio"
                                    label={t.label}
                                    checked={type.value === t.value}
                                    onClick={() => setType(t)}
                                />
                            ))}
                        </div>
                        <Button onClick={handlePrint}>Print</Button>
                    </Form.Group>
                </Popover.Body>
            </Popover>
        </Overlay>
        </>

    )
}
