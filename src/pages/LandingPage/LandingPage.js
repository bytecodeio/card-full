import React, {Fragment, useEffect, useState} from 'react'
import { getLandingPageApplications, updatePageViews } from '../../utils/writebackService'
import { useContext } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { ButtonGroup, Button, InputGroup, Form, Container, Tooltip, OverlayTrigger, Row, Col } from 'react-bootstrap';
import ToTopButton from "../../components/ToTopButton.js";

export const LandingPage = ( {description} ) => {
    const extensionContext = useContext(ExtensionContext)
    const sdk = extensionContext.core40SDK;
    const { hostUrl, extensionId } = extensionContext.extensionSDK.lookerHostData;

    const [apps, setApps] = useState([])
    const [allApps, setAllApps] = useState([])
    const [selectedButton, setSelectedButton] = useState("grid")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedOrder, setSelectedOrder] = useState("alpha")
    const [project, setProject] = useState(extensionId.split("::")[0])

    //Initial App list loading
    const getApps = async() => {
        let _context = await getContextData()
        console.log("context",_context)
        let _apps = syncContextData()
        if (_context?.length > 0) {
            _apps = await orderApps(_context)
            setApps(_context)
            setAllApps(_context)
        }
    }

    useEffect(() => {
        getApps();
    },[])

    const syncContextData = async () => {
        let _apps = [];
        try {
            _apps = await getLandingPageApplications(sdk);
            console.log("query",_apps)
            if (_apps.length > 0) {
                updateContextData(_apps)
            }
        } catch (ex){            
            console.error(ex)
        }
    }

    const getContextData = async () => {
        return await extensionContext.extensionSDK.getContextData()
    }

    const updateContextData = (context) => {
        extensionContext.extensionSDK.saveContextData(context)
    }

    //Ordering the apps between either the rank or alphabetical
    const orderApps = async (apps, order=selectedOrder) => {
        if (order === "rank") {
            let _apps = sortApps(apps, 'views')
            return _apps.reverse()
        } else {            
            return sortApps(apps, 'name')
        }
    }

    //Click event to add a view to the app in the database and open a new tab in the browser to the url below
    const handleClick = async (app) => {
        let url = `/embed/extensions/${project}::${app.route}`
        console.log("url",url)
        extensionContext.extensionSDK.openBrowserWindow(url, '_blank')

        //await updatePageViews(sdk,app.id)
        //getApps()
    }

    const handleButtonGroupClick = (v) => {
        setSelectedButton(v)
    }

    const handleSearchTerm =(e) => {
        setSearchTerm(e.target.value)
    }

    //Search functionality
    const handleSearchButton = () => {
        const data = [...allApps];
        let _apps = searchTerm.replace(" ") != ""? data.filter(d => d.name.toUpperCase().includes(searchTerm.toUpperCase())):data;
        setApps(_apps)
    }

    //When the order button group is selected/changed
    const handleSortChange = async (type) => {
        setSelectedOrder(type)
        let _apps = [...apps];
        let _allApps = [...allApps];
        _apps = await orderApps(_apps,type)
        _allApps = await orderApps(_allApps,type)
        setApps(_apps)
        setAllApps(_allApps)
    }


    //Sorting based on the type variable
    const sortApps = (data, type) => {
        return data.sort((a,b) => {
           var x = a[type].toString().toLowerCase();
           var y = b[type].toString().toLowerCase();
               return x < y ? -1 : x > y ? 1 : 0;
           });
       }



    return(
        <Fragment>
          <Container fluid>
          <Row>

        <div className='landing-page-action'>
          <Col className='col-md-1 col-3'>
          <div className="d-flex justify-content-start align-items-baseline">
          <p className="small mr-1">view</p>


            <ButtonGroup size="sm" className='landing-page-button-group'>
                <Button onClick={() => handleButtonGroupClick("grid")} active={selectedButton == "grid"} value={"grid"}>
                    <i className="far fa-th"></i>
                </Button>
                <Button onClick={() => handleButtonGroupClick("list")} active={selectedButton == "list"} value={"list"}>
                    <i className='far fa-bars'></i>
                </Button>

            </ButtonGroup>

            </div>
            <div className="d-flex justify-content-start align-items-baseline mt-3">
            <p className="small mr-1">sort</p>
            <ButtonGroup size="sm" className='landing-page-button-group'>
                <Button active={selectedOrder === "alpha"} onClick={() => handleSortChange('alpha')}>
                    <i className="fal fa-sort-alpha-up"></i>
                </Button>
                <Button active={selectedOrder === "rank"} onClick={() => handleSortChange('rank')}>
                    <i className='fal fa-analytics'></i>
                </Button>
            </ButtonGroup>
            </div>
              </Col>
            <Col className='col-10'>
            <InputGroup className='landing-page-search'>
                <Form.Control id='search' placeholder='Search' onChange={handleSearchTerm} onKeyDown={(e) => e.keyCode == "13"? handleSearchButton():''}>
                </Form.Control>
                <Button onClick={handleSearchButton}>Go</Button>
            </InputGroup>
            </Col>

        </div>

        </Row>
        </Container>
        <Container>
          <Row>
        <div className='landing-page-container'>
            {apps?.map(a =>
            selectedButton == "grid"?
            <OverlayTrigger key={a.name}
              placement="right"
              overlay=<Tooltip id="squares"><p style={{fontSize:"12px"}}>{a.tooltip_description}</p></Tooltip>
              className="tooltipHover"
            >
                <a className='landing-page-content' href={`#`} onClick={() => handleClick(a)}>
                    <div className='landing-page-item'>
                        {a.thumbnail_base64 != null?
                        <img className='looker-thumbnail' src={a.thumbnail_base64} onError={(e) => {e.target.onError=null; e.target.src="/"}} />
                        :<div className='looker-thumbnail not-available'>Preview Not Available</div>
                        }
                        <div className='landing-page-item-detail'>
                            {a.name}
                            <p className='rank' dangerouslySetInnerHTML={{__html: a.label}} />
                        </div>
                    </div>
                </a>
              </OverlayTrigger>
                :
                <a key={a.name} href={`#`} className={`landing-page-row ${apps.indexOf(a) % 2? 'even':'odd'}`} onClick={() => handleClick(a)}>
                    <div>
                        <h6>{a.name}</h6>
                    </div>
                </a>
            )}
        </div>
        </Row>
        </Container>
       <ToTopButton />
      </Fragment>
    )
}
