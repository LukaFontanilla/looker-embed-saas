import { useContext, useEffect, useState } from "react";
import { NavContext } from "../contexts/NavContext";
import { PermissionsContext } from "../contexts/PermissionsContext";
import { ReportConfigContext } from "../contexts/ReportConfig";
import { addData, getStoreData, deleteData } from "../helpers/db";

const useSalesInsightsFetch = () => {
  const { active } = useContext(NavContext);
  const { queryID } = useContext(ReportConfigContext);
  const [error, setError] = useState();
  const [cardData, setCardData] = useState();
  const [barChartData, setBarChartData] = useState();
  const [status, setStatus] = useState("");
  const { sdk } = useContext(PermissionsContext);

  /**
   * Helper async function to fetch Looker Query Data
   * @param {{query_id: string, result_format: string, apply_formatting: boolean, cache: boolean}} data Looker Run Query, query object
   */
  const fetchLookerData = async (data) => {
    try {
      return await sdk.ok(sdk.run_query(data));
    } catch (e) {
      setError(e);
      return undefined;
    }
  };

  /**
   * Helper function to set browser cache and fetch from browser cache
   * @param {string} queryID query ID of the Looker Query
   */
  const fetchedFromDB = async (queryID) => {
    await deleteData("homepage");
    setStatus("fetching");
    const queryResponses = await Promise.all([
      await fetchLookerData({
        query_id: "53147", //'4240', // the id of the query in Looker revenue, subscriptions, sales, active now
        result_format: "json",
        apply_formatting: true,
        cache: true,
      }),
      queryID !== "" && queryID !== undefined
        ? await fetchLookerData({
            query_id: queryID, //"53185", //'53185', // the id of the query in Looker for revenue over time
            result_format: "json",
            cache: true,
          })
        : [],
    ]);
    setStatus("AddToDB");
    await Promise.all([
      await addData(
        "homepage",
        queryResponses[0] === undefined ? undefined : queryResponses[0][0],
      ),
      await addData(
        "homepage",
        queryResponses[1] === undefined ? [] : queryResponses[1],
      ),
    ]);
    setStatus("AddedToDB");
    const fetchData = await getStoreData("homepage");
    return fetchData;
  };

  useEffect(() => {
    if (active === "Sales") {
      async function fetchData() {
        setStatus("checkDB");
        // const data = await getStoreData("homepage");
        // console.log(data);
        // if (
        //   data.length === 0
        // || data[1].length === 0
        // ) {
        const queryData = await fetchedFromDB(queryID);
        return queryData;
        // }
        // setStatus("fetchedFromDB");
        // return data;
      }
      fetchData().then((res) => {
        console.log(res);
        setCardData(res[0]);
        setBarChartData(res[1]);
        setStatus("fetchedFromDB");
        setTimeout(() => setStatus(""), 2000);
      });
    }
  }, [active, queryID]);

  return [cardData, barChartData, status];
};

export default useSalesInsightsFetch;
