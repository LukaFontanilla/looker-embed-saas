import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

// example data
const data = [
  {
    lastWeek: 400,
    today: 240,
  },
  {
    lastWeek: 300,
    today: 139,
  },
  {
    lastWeek: 200,
    today: 980,
  },
  {
    lastWeek: 278,
    today: 390,
  },
  {
    lastWeek: 189,
    today: 480,
  },
  {
    lastWeek: 239,
    today: 380,
  },
  {
    lastWeek: 349,
    today: 430,
  },
];

/**
 * @param {Object[]} data array of data points
 */
const HomepageLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width={"100%"} height={200}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                      Last Week
                    </span>
                    <span className="font-bold text-muted-foreground text-black dark:text-white">
                      {payload[0].value}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground text-black dark:text-white">
                      Today
                    </span>
                    <span className="font-bold text-black dark:text-white">
                      {payload[1].value}
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="lastWeek"
          activeDot={{
            r: 6,
            style: { fill: "#fff", opacity: 0.25 },
          }}
          style={{
            stroke: "#d18",
            opacity: 0.5,
          }}
        />
        <Line
          type="monotone"
          dataKey="today"
          strokeWidth={2}
          activeDot={{
            r: 8,
            style: { fill: "#d18", opacity: 0.25 },
          }}
          style={{
            stroke: "#d18",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const HomepageLineChartContainer = () => {
  return (
    <div className="rounded-xl light:border light:bg-transparent dark:bg-black shadow-lg hover:drop-shadow-lg">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 text-black dark:text-white">
        <h3 className="tracking-tight text-sm font-medium text-black dark:text-white">
          Daily Pulse
        </h3>
        Usage Overtime
      </div>
      <div className="p-6 pt-0 pl-2">
        <HomepageLineChart data={data} />
      </div>
    </div>
  );
};

export default HomepageLineChartContainer;
