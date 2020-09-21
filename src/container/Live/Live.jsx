import React, { useEffect, useState } from "react";
import io from "socket.io-client";
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

const Live = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [datarevision, setDatarevision] = useState(0);
  // const [xVal, setXVal] = useState([]);
  // const [open , setOpen] = useState([]);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const socket = io("http://kaboom.rksv.net/watch");
    socket.on("connect", () => {
      console.log(socket.connected); // true
      socket.emit("sub", { state: true });
      const dateArr = [];
      const closeArr = [];
      const highArr = [];
      const lowArr = [];
      const openArr = [];
      socket.on("data", (data, callback) => {
        const dataArr = data.split(",");
        const dt = new Date(+dataArr[0]);
        if (dateArr.length >= 20) {
          dateArr.shift();
          closeArr.shift();
          highArr.shift();
          lowArr.shift();
          openArr.shift();
        }
        dateArr.push(
          `${dt.getFullYear()}-${
            dt.getMonth() + 1
          }-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}.${dt.getMilliseconds()}`
        );
        openArr.push(+dataArr[1]);
        highArr.push(+dataArr[2]);
        lowArr.push(+dataArr[3]);
        closeArr.push(+dataArr[4]);
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
        setDatarevision((d) => d + 1);
        callback(1);
      });
    });
    return () => {
      socket.emit("unsub", { state: false });
      socket.close();
    };
  }, []);
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
        <h1>Live</h1>
        {isReady && (
          <Plot
            data={data}
            layout={{
              datarevision: { datarevision },
              dragmode: "pan",
              margin: {
                r: 0,
                t: 20,
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
                type: "date",
              },
              yaxis: {
                autorange: false,
                range: [0, 2000],
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

export default Live;
