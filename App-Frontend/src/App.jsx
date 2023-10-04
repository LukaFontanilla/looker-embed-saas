import { useState, useEffect, useContext } from 'react'
import './App.css'
import LeftNav from './components/LeftNav'
import { LookerEmbedSDK } from "@looker/embed-sdk";
import {NavContext}  from './contexts/NavContext'
import {DashboardContext}  from './contexts/DashboardContext'
import { PermissionsContext } from './contexts/PermissionsContext'
import TopBanner from './components/TopBanner'
import Footer from './components/Footer'
import Home from './components/Home'
import { sdk } from './helpers/CorsSessionHelper'
import { initDB } from './helpers/db'
import { initializeDashboard } from './helpers/staticAssets'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from "react-router-dom";
import { DarkModeContext } from './contexts/DarkModeContext';


function App() {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState('Home')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState()
  const [locale, setLocale] = useState('en')
  const [trafficSource, setTrafficSource] = useState('')
  // const [company, setCompany] = useState('Calvin Klein')
  const [pdf, setPdf] = useState(true)
  const [permissions, setPermissions] = useState([])
  const [id, setID] = useState(import.meta.env.VITE_SALES_DASHBOARD_ID)
  const [dark, setDark] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  const EmbedSDKInit = () => {
        LookerEmbedSDK.init(
            import.meta.env.VITE_LOOKERSDK_EMBED_HOST,
            {
              // The location of the service which will privately create a signed URL
              url: '/api/auth'
              , headers: [
                // include some factor which your auth service can use to uniquely identify a user, so that a user specific url can be returned. This could be a token or ID
                { name: 'usertoken', value: 'user1' }
              ]
            }
        )
    }
  EmbedSDKInit();

  useEffect(() => {
    // initialize indexdb
    initDB()
  },[])

  useEffect(() => {
    fetch('/api/permissions', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        permissions: {
          pdf: pdf ? "download_with_limit" : false,
        },
        userAttributes: {
          locale: locale,
        }
      })
      })
      .then(res => {
        setID(initializeDashboard(active))
        setPermissions([locale,pdf])
      })
  }, [locale,pdf])

  useEffect(() => {
    if(dashboard && trafficSource !== '') {
      dashboard.send("dashboard:filters:update", {
        filters: {
          "Traffic Source": trafficSource
        }
      })
      
      dashboard.send("dashboard:run")
    }
  },[trafficSource])


  return (
    <>
    <NavContext.Provider value={{active, setActive}}>
    <DarkModeContext.Provider value={{dark, setDark}}>
    <DashboardContext.Provider value={{dashboard, setDashboard, loading, setLoading, id, setID}}>
    <PermissionsContext.Provider value={{sdk, locale, setLocale, trafficSource, setTrafficSource, pdf, setPdf, show, setShow, permissions}}>
    <Router>
      <div className={dark ? 'dark' : 'light'}>
      <div className="flex flex-col h-screen w-screen bg-white dark:bg-black" >
      <TopBanner />
      <div className="flex flex-1 overflow-hidden" >
        <LeftNav />
        <main className="flex-1 overflow-y-scroll p-4 bg-zinc-50 dark:bg-black" onClick={() => setShow(false)}>
          <div className="grid gap-1 h-full relative" >
          <Routes>
            <Route
              exact
              default
              path="/"
              element={<Home />}
            />

           
            {/* <div className="h-96 rounded-lg bg-zinc-100 dark:bg-zinc-800"  />
            <div className="h-96 rounded-lg bg-zinc-100 dark:bg-zinc-800"  /> */}
            {/* <Route
                  exact
                  path="/analytics"
                  element={<AnalyticsPage />}/> */}
            {/* {active === 'Custom' && <NLQExplore />} */}
          </Routes>
          </div>
        </main>
      </div>
      <Footer />
    </div>
    </div>
    </Router>
    </PermissionsContext.Provider>
    </DashboardContext.Provider>
    </DarkModeContext.Provider>
    </NavContext.Provider>
    </>
  )
}

export default App
