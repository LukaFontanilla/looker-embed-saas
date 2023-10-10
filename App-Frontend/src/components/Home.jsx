import {useContext} from 'react'
import {NavContext}  from '../contexts/NavContext'
import EmbedDashboard from './EmbedDashboard'
import CustomSalesDashboard from './CustomSalesDashboard'
import {DashboardContext}  from '../contexts/DashboardContext'
import { PermissionsContext } from '../contexts/PermissionsContext'
import { DarkModeContext } from '../contexts/DarkModeContext'
import { initializeDashboard, homePageConfig } from '../helpers/staticAssets'
import HomepageLineChartContainer from './HomepageLineChart'
import SSOEmbedComponent from './SSOEmbedComponent'

/**
 * Static Dashboard ID For Workshop
 * Step 1: Grab Dashboard ID from Looker Instance
 * Step 2: Add Dashboard ID to dashboardID variable below
 */

const dashboardID = ''

const Home = () => {
  const {active, setActive} = useContext(NavContext)
  const {dashboard, setDashboard, loading, setLoading, id, setID} = useContext(DashboardContext)
  const { trafficSource,locale,pdf } = useContext(PermissionsContext)
  const { dark } = useContext(DarkModeContext)

  const handleDashboardClick = (type) => {
    active === 'Explore' && setID(initializeDashboard(type))
    setActive(type)
    setLoading(true)
    dashboard.send("dashboard:load", {
      id: initializeDashboard(type),
      pushHistory: true
    })

    dashboard.send("dashboard:run")
  }

  const handleExploreClick = (type) => {
    setActive(type)
    setLoading(true)
    setID(null)
  }

  return (
    <>
    <div className={`p-4 ${active === 'Home' ? 'block' : 'fixed'} ${active === 'Home' ? 'z-1' : '-z-20'}`} style={{height:'70vh'}} id="home">
    <section className="mb-14">
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Welcome Luka!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-transparent dark:bg-zinc-800 shadow-lg rounded-xl w-120 hover:drop-shadow-lg" 
          >
          <HomepageLineChartContainer />
          </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Weekly Analytics Wrap</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Brief summary of your weekly analytics data.
              </p>
            </div>
          </div>
        </section>
        {homePageConfig.map((section, index) => (
          <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{section.section}</h2>
          <div className={`grid ${index === 0 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
          {section['sub-sections'].map((subsection, index) => (
            <div>
              <div onClick={() => subsection.title === 'Explore' ? handleExploreClick(subsection.title) : handleDashboardClick(subsection.title)}> 
              <div className="bg-white flex justify-center items-center dark:bg-black shadow-lg p-2 rounded-xl h-40 hover:brightness-125 hover:drop-shadow-lg mb-2" id={'svgBackground' + (index + 2).toString()}>
              <h3 className="text-4xl font-bold mb-2 mt-4 dark:text-black text-white" 
              style={{ 
                textShadow:'0px 1px 0px rgba(221,17,153,.9), 0px -1px 0px rgba(0,0,0,.7)',
                // color: '#fff', 
              }}>{subsection.title}</h3>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                {subsection.description}
              </p>
              </div>
            </div>
          ))}
          </div>
        </section>
        ))}
    </div>
    <EmbedDashboard id={id || import.meta.env.VITE_SALES_DASHBOARD_ID}/>
    <CustomSalesDashboard />
    {active === 'New' ? <SSOEmbedComponent url={dashboardID !== '' ? import.meta.env.VITE_LOOKER_HOST + '/embed/dashboards/' + dashboardID : ''} /> : <> </>}
    </>
  )
}

export default Home;