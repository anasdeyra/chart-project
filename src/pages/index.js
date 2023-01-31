import { useEffect, useState } from "react";
import { getAll } from "../api";
import ViewsChart from "../components/ViewsChart";
import { getChartColor } from "../util";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAll().then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gridGap: "1rem",
        maxWidth: "1200px",
        margin: "0 auto",
        marginTop: "5rem",
      }}
    >
      {data.map(({ dataset, domain, name }, i) => {
        const color = getChartColor({ data: dataset });
        return (
          <div
            style={{
              backgroundColor: "white",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
              borderRadius: "8px",
              border: "1px solid #F2F4F7",
            }}
            key={i}
          >
            <div
              style={{
                margin: "20px",
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#101828",
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#475467",
                  marginTop: "4px",
                }}
              >
                Track how many monthly visits on {domain}
              </div>
            </div>

            <ViewsChart id={i} color={color} data={dataset} />
          </div>
        );
      })}
    </div>
  );
}
