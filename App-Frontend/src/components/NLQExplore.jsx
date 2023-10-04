import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { initDB, addData, getStoreData } from "../helpers/db";

const NLQExplore = () => {
    const [loading, setLoading] = React.useState(true);
    const [query, setQuery] = React.useState("");
    const [submit, setSubmit] = React.useState(false);
    const [exploreUrl, setExploreUrl] = React.useState("");
    const [iframeLoading, setIframeLoading] = React.useState(true);
    const [db, setDb] = React.useState(false);
    const [data, setData] = React.useState([]);
    const initialize = async () => {
        const status = await initDB();
        setDb(status)
        const responses = await getStoreData('chat')
        setData(responses)
    }
    // initialize();

    useEffect( () => {
        initialize()
    }, [])

    const handleChange = (e) => {
        setQuery(e.currentTarget.value)
    }

    const handleSubmit = async () => {
        const status = await initDB();
        setDb(status)
        console.log(query)
        const res = await addData('chat', {message:query})
        console.log(res)
        setData([...data, {message:query}])
        setSubmit(true)
        async function fetchData() {
        const responseData = await fetch(import.meta.env.VITE_LLM_ENDPOINT, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            question: query
            })
        })

        const exploreData = await responseData.text()
        console.log(exploreData)
        // generateExploreUrlText(context + query)
        // exploreData.candidates[0].output.split('output:')[1].split("&").map((param) => 
        //   console.log(param.split("=")[0],param.split("=")[1])
        // )
        setExploreUrl(exploreData.trim() + "&toggle=dat,pik,vis")
        }

        console.log("Explore: ", import.meta.env.VITE_LOOKERSDK_EMBED_HOST + '/embed/explore/thelook/order_items?' + exploreUrl)

        fetchData()
    }

    




    return (
        <>
        <ExploreContainer>
            <Explore>
                {exploreUrl ? <iframe src={import.meta.env.VITE_LOOKER_HOST + '/embed/explore/thelook/order_items?' + exploreUrl} frameBorder={0}/> : <div className="w-6/12 h-3/6 contents animate-pulse"><img className="animate-pulse" height={500} width={500} src="https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/insights_auto/wght200grad200fill1/48px.svg"/></div>}
            </Explore>
            <div style={{
                position:'fixed', 
                bottom:30, 
                right:30, 
                width:'15vw', 
                height:'30vh',
                borderRadius:'0.8rem', 
                boxShadow:'0 0 10px 0 rgba(0, 0, 0, 0.1)',
                zIndex:1,
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-evenly',
                backgroundColor:'#fff'
                }}>
                <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    alignContent:'center',
                    height:'10%',
                    boxShadow: '0 3px 7px -7px grey'
                }}>
                    <span style={{fontSize:'2vh'}}>Recent Search Queries</span>
                </div>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    height:'80%',
                    width:'100%',
                    overflowY:'scroll',
                }}>
                {db && data.length > 0 && data.map((item,index) => {
                    return (
                        <div onClick={() => handleSubmit()}style={{margin:'1rem',padding:'0.2rem',height:'100%',borderRadius:'0.6rem',backgroundColor:'rgb(66, 135, 245,0.09)',overflowX:'clip'}}>{item.message}</div>
                    )
                })
                }
                </div>
                <div style={{paddingLeft:'0.8rem',paddingRight:'0.8rem',height:'10%',zIndex:1,borderTop:'1px solid grey',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center', alignContent:'center'}}>
                    <input onChange={handleChange} style={{}}/>
                    <button className="p-1" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </ExploreContainer>
        </>

    )


}

export default NLQExplore;

const Explore = styled.div`
  z-index: 1;
  width: 100%;
  height: 90%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const ExploreContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding: 3rem;
  width: 100%;
  height: 90vh;
`;