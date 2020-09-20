import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "2rem auto",
  },
  plotContainer: {
    width: "100%",
    height: "70vh",
  },
}));

const Historical = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const API_CALL = "http://kaboom.rksv.net/api/historical";
    fetch(API_CALL)
      .then((res) => res.json())
      .then((data) => {
        const dateArr = [];
        const closeArr = [];
        const highArr = [];
        const lowArr = [];
        const openArr = [];
        for (let item of data) {
          const dataArr = item.split(",");
          const dt = new Date(+dataArr[0]);
          dateArr.push(
            `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`
          );
          openArr.push(+dataArr[1]);
          highArr.push(+dataArr[2]);
          lowArr.push(+dataArr[3]);
          closeArr.push(+dataArr[4]);
        }
        setData([
          {
            x: dateArr,
            close: closeArr,
            high: highArr,
            low: lowArr,
            open: openArr,
            increasing: { line: { color: "green" } },
            decreasing: { line: { color: "red" } },
            type: "candlestick",
            xaxis: "x",
            yaxis: "y",
          },
        ]);
        setIsReady(true);
        return data;
      })
      .catch((err) => console.error(err.message));
  }, [setData]);
  return (
    <Grid
      container
      item
      spacing={3}
      className={classes.container}
      xs={12}
      sm={11}
      md={10}
    >
      <Grid item xs={12}>
        <h1>Hisotrical</h1>
        {isReady && (
          <Plot
            data={data}
            layout={{
              dragmode: "pan",
              margin: {
                r: 0,
                t: 0,
                b: 30,
                l: 30,
              },
              autosize: true,
              showlegend: false,
              xaxis: {
                autorange: true,
                rangeslider: {
                  visible: false,
                },
                range: ["2005-01-01", "2014-12-31"],
                type: "date",
              },
              yaxis: {
                autorange: true,
                range: [500, 3300],
                type: "linear",
              },
            }}
            config={{ scrollZoom: true, displayModeBar: false }}
            useResizeHandler={true}
            className={classes.plotContainer}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Historical;
