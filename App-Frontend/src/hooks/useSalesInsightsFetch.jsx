import { useContext, useEffect, useState } from "react";
import { NavContext } from "../contexts/NavContext";
import { PermissionsContext } from "../contexts/PermissionsContext";
import { ReportConfigContext } from "../contexts/ReportConfig";
import { addData, getStoreData, deleteData } from "../helpers/db";

const useSalesInsightsFetch = () => {
  const { active } = useContext(NavContext);
  const { queryID } = useContext(ReportConfigContext);
  const [cardData, setCardData] = useState();
  const [barChartData, setBarChartData] = useState();
  const [status, setStatus] = useState("");
  const { sdk } = useContext(PermissionsContext);

  const fetchedFromDB = async (queryID) => {
    await deleteData("homepage");
    setStatus("fetching");
    const queryResponses = await Promise.all([
      await sdk.ok(
        sdk.run_query({
          query_id: "53147", //'4240', // the id of the query in Looker revenue, subscriptions, sales, active now
          result_format: "json",
          apply_formatting: true,
          cache: true,
        }),
      ),
      queryID !== "" && queryID !== undefined
        ? await sdk.ok(
            sdk.run_query({
              query_id: queryID, //"53185", //'53185', // the id of the query in Looker for revenue over time
              result_format: "json",
              cache: true,
            }),
          )
        : [],
    ]);
    setStatus("AddToDB");
    await Promise.all([
      await addData("homepage", queryResponses[0][0]),
      await addData("homepage", queryResponses[1]),
    ]);
    setStatus("AddedToDB");
    const fetchData = await getStoreData("homepage");
    console.log("fetch: ", fetchData);
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
