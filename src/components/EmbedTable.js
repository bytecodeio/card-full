import React, { useCallback, useContext, useState, useEffect } from "react";
import { LookerEmbedExplore, LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";
import { waveform } from "ldrs";

import { ApplicationContext } from "../Main2";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { LoadingComponent } from "./LoadingComponent";
import { TabContext } from "./ReportContainer";
import { NoRowsMessage } from "./LayoutComponents/EmbedMessages/NoRowsMessage";
import { ErrorMessage } from "./LayoutComponents/EmbedMessages/ErrorMessage";

waveform.register()

const Explore = styled.div`
  width: 100%;
  min-height: unset;
  margin-top: -30px;
  position: relative;
  & > iframe {
    width: 100%;
    height: 95%;
    margin-left:0px;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmbedTable = ({ queryId, vis }) => {

  const { application } = useContext(ApplicationContext)
  const { extensionSDK, core40SDK:sdk } = useContext(ExtensionContext);
  
  const {isLoading,setIsLoading} = useContext(TabContext)
  
  const dev = false

  const [isLoadingViz, setIsLoadingViz] = useState(false)
  const [message, setMessage] = useState({status:'ok'})

  // useEffect(() => {
  //   console.log("isLoading",isLoading)
  //   setIsLoadingViz(true);
  //   //setIsLoading({[vis.title]:false})
  // },[isLoading[vis.title]==true])
  useEffect(() => {
    setMessage({status:'ok'})
    console.log("isLoading",vis.isLoading + ' ' + vis.title)    
    setIsLoadingViz(true);
  },[vis.isLoading == true])

  useEffect(() => {
    const checkQuery = async () => {
      let _message = {...message}
      _message['status'] = 'ok'
      setMessage(_message)
      console.log("query id embed",vis.query_id)
      if (vis.query_id !== "" && vis.query_id !== undefined) {
        let results = await sdk.run_query({query_id:vis['query_id'], result_format:'json', cache:true})
        if (results.value.length == 0) {
          setMessage({status:'no results'})
          return;
        }
        if (results.value[0]['looker_error']) {
          setMessage({status:'error'})
          return;
        }
        if (results.value.length > 0) {
          setMessage({status:'ok'})
          return;
        }
      }
    }
    checkQuery();    
  },[vis.query_id])

  const handleRunComplete =(e) => {
    console.log("event",e)
    setIsLoadingViz(false)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionSDK.lookerHostData.hostUrl;
      if (el && hostUrl && queryId) {
        el.innerHTML = "";
        let _hideBorderEl = document.createElement('div');
        _hideBorderEl.className="hide-left-border";
        el.appendChild(_hideBorderEl)
        // LookerEmbedSDK.init(hostUrl);
        LookerEmbedSDK.createExploreWithUrl(
            `${hostUrl}/embed/query/${application.model}/${application.explore}?${vis.visUrl}&sdk=2&embed_domain=${dev?'http://localhost:8080':hostUrl}&sandboxed_host=true`
          )
          .appendTo(el) 
          //.on('explore:run:start', (e) => handleRunComplete(e)) 
          .on('explore:run:complete', (e) => handleRunComplete(e)) 
          //.on('explore:ready', (e) => handleRunComplete(e)) 
          //.on('explore:state:changed', (e) => handleRunComplete(e))              
          .build()
          .connect() 
          .catch((error) => {
            console.error("Connection error", error);
          });
      }
    },
    [vis.visUrl]
  );

  return (
    <>
      {message.status == "no results"?
        <NoRowsMessage />
      :''}
      {message.status == "error"?
        <ErrorMessage />
      :''}
      {isLoadingViz?
        <LoadingComponent />
        :
      ''}
      {/* <div class="hide-left-border"></div> */}
      {queryId ? <Explore ref={embedCtrRef}/>: <Spinner />}
    </>
  );
};

export default EmbedTable;
