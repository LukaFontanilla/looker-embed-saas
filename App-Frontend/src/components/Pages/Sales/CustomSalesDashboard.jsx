import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  Label,
} from "recharts";
import React, { useContext, useState } from "react";
import { NavContext } from "../../../contexts/NavContext";
import { DarkModeContext } from "../../../contexts/DarkModeContext";
import useSalesInsightsFetch from "../../../hooks/useSalesInsightsFetch";
import { PieChart, Pie, Sector, Cell } from "recharts";
import AccountTable from "./AccountTable";
import QueryStatus from "./QueryStatus";
import EmbedMethodHighlight from "../../EmbedMethodHighlight";

const data = [
  { name: "Search", value: 400 },
  { name: "Google Ads", value: 300 },
  { name: "Facebook", value: 300 },
  { name: "Bing", value: 200 },
];
const COLORS = [
  "rgb(220,168,154,1)",
  "rgb(209,138,154,0.8)",
  "rgb(209,138,154,0.5)",
  "rgb(209,138,154,0.2)",
];
const kFormatter = (num) =>
  Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
/**
 * @param {} data looker data object for x axis
 */
const getXValue = (data) => data[Object.keys(data)[0]];

/**
 * @param {} data looker data object for y axis
 */
const getYValue = (data) => data[Object.keys(data)[1]];

const yValueFormatter = (yValue) =>
  kFormatter(yValue).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

/**
 * @param {string} trafficSource traffic source value
 */
const DashboardPieChart = ({ trafficSource }) => {
  return (
    <ResponsiveContainer height={200}>
      <PieChart>
        <Pie
          data={data}
          cx={"50%"}
          cy={"50%"}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              stroke="rgb(209,138,154,0.2)"
              key={`cell-${index}`}
              fill={
                entry.name === trafficSource
                  ? COLORS[0]
                  : COLORS[COLORS.length - 1]
              }
            />
          ))}
          <Label
            value={data.filter((d) => d.name === trafficSource)[0].value}
            position="center"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * @param {React.ReactNode} children the children jsx elements
 */
const VizContainer = ({ children }) => {
  return <ResponsiveContainer height={350}>{children}</ResponsiveContainer>;
};

/**
 * @param {} data the looker query data object, should be time series
 * @param {string} type the type of the chart, area or bar
 */
const OverviewViz = ({ data, type }) => {
  return (
    <VizContainer>
      {type === "area" ? (
        <AreaChart data={data}>
          <XAxis
            dataKey={getXValue}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d18" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#d18" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div>
                    <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                      {getXValue(payload[0].payload)}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                          Average
                        </span>
                        <span className="font-bold text-muted-foreground text-black dark:text-white">
                          {yValueFormatter(payload[0].value * Math.random())}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                          This Week
                        </span>
                        <span className="font-bold text-black dark:text-white">
                          {yValueFormatter(payload[0].value)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
          <Area
            dataKey={getYValue}
            stroke="#d18"
            fill="url(#color)"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="linear"
          />
        </AreaChart>
      ) : (
        <BarChart data={data}>
          <XAxis
            dataKey={getXValue}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d18" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#d18" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={{ fill: "rgb(238,23,148,0.1)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div>
                    <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                      {getXValue(payload[0].payload)}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                          Average
                        </span>
                        <span className="font-bold text-muted-foreground text-black dark:text-white">
                          {yValueFormatter(payload[0].value * Math.random())}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                          This Week
                        </span>
                        <span className="font-bold text-black dark:text-white">
                          {yValueFormatter(payload[0].value)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
          <Bar
            dataKey={getYValue}
            stroke="#d18"
            fill="url(#color)"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="linear"
          />
        </BarChart>
      )}
    </VizContainer>
  );
};

/**
 * @param {string} title title of the card
 * @param {string} child child value
 * @param {string} value value formatted query result from Looker
 * @param {string} change percentage from previous
 */
const DashboardCards = ({ title, child, value, change }) => {
  return (
    <div className="rounded-xl light:border bg-card bg-white dark:bg-zinc-900 text-card-foreground shadow hover:drop-shadow-lg">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-black dark:text-white">
          {title ? title : ""}
        </h3>
        {child ? child : ""}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold text-black dark:text-white">
          {value ? value : ""}
        </div>
        <p className="text-xs text-muted-foreground text-zinc-500 dark:text-zinc-400">
          {change ? change : ""}
        </p>
      </div>
    </div>
  );
};

const DashboardCardsConfig = [
  {
    title: "Total Revenue",
    child: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    value: "$45,231.89",
    change: "+20.1% from last month",
  },
  {
    title: "Subscriptions",
    child: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    value: "+2350",
    change: "+180.1% from last month",
  },
  {
    title: "Customer Lifetime Value",
    child: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    value: "+12,234",
    change: "+19% from last month",
  },
  {
    title: "Active Now",
    child: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    value: "+573",
    change: "+201 since last hour",
  },
];

const CustomSalesDashboard = () => {
  const { active, showSource } = useContext(NavContext);
  const { dark } = useContext(DarkModeContext);
  const [viz, setViz] = useState("area");
  const [trafficSource, setTrafficSource] = useState("Search");
  const [cardData, barChartData, status] = useSalesInsightsFetch();

  return (
    <div
      id="sales"
      className={`${
        active === "Sales" ? "z-1" : "-z-10"
      } p-4 space-y-4 w-full h-full flex flex-col justify-stretch ${
        active === "Sales" ? "absolute" : "fixed"
      }`}
    >
      {status ? <QueryStatus status={status} /> : <></>}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 h-auto items-center justify-center content-center">
        {cardData !== undefined
          ? DashboardCardsConfig.map((card, index) => (
              <DashboardCards
                key={index}
                title={card.title}
                child={card.child}
                value={cardData[Object.keys(cardData)[index]]}
                change={card.change}
              />
            ))
          : DashboardCardsConfig.map((card, index) => (
              <DashboardCards
                key={index}
                title={card.title}
                child={card.child}
                value={false}
                change={card.change}
              />
            ))}
      </div>
      <div className="grid gap-y-2 gap-x-0 xl:gap-4 grid-cols-1 lg:grid-cols-1 xl:grid-cols-6">
        <div className="relative col-span-5 rounded-xl light:border bg-card text-card-foreground bg-white dark:bg-zinc-900 shadow hover:brightness-100 hover:drop-shadow-lg">
          <EmbedMethodHighlight />
          <div className="flex flex-row justify-between align-middle items-center mb-4">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight text-black dark:text-white">
                Overview
              </h3>
            </div>
            <div className="flex flex-row space-x-2 pr-2">
              <button
                onClick={() => setViz("line")}
                className="text-black dark:text-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Bar
              </button>
              <button
                onClick={() => setViz("area")}
                className="text-black dark:text-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Area
              </button>
            </div>
          </div>
          <div className="p-6 pt-0 pl-2 h-[30vh]">
            {barChartData !== undefined ? (
              <OverviewViz data={barChartData} type={viz} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-xl light:border bg-card text-card-foreground bg-white dark:bg-zinc-900 shadow hover:brightness-100 hover:drop-shadow-lg">
            <div className="flex flex-col space-y-1 p-4">
              <h3 className="font-semibold leading-none tracking-tight text-black dark:text-white">
                Sign Ups by Source
              </h3>
            </div>
            <div className="p-4 pt-0 pl-2 grid gap-2 grid-cols-2">
              {["Search", "Google Ads", "Facebook", "Bing"].map((val) => (
                <button
                  onClick={() => setTrafficSource(val)}
                  className="text-black dark:text-white inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl light:border bg-card text-card-foreground bg-white dark:bg-zinc-900 shadow hover:brightness-100 hover:drop-shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight text-black dark:text-white">
                Sign Ups by Source
              </h3>
            </div>
            <div className="p-6 pt-0 pl-2">
              {trafficSource && (
                <DashboardPieChart trafficSource={trafficSource} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-y-2 grid-cols-1">
        <AccountTable theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
};
export default CustomSalesDashboard;
