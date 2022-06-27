const http = require("http");
const fs = require("fs");
const requests = require("requests");
const { REPL_MODE_SLOPPY } = require("repl");

const homefile = fs.readFileSync("index.html", "utf-8");

const replaceval = (tempval, orgval) => {
  let tempreature = tempval.replace("{%tempval%}", orgval.main.temp - 273);
  tempreature = tempreature.replace(
    "{%mintempval%}",
    orgval.main.temp_min - 273
  );
  tempreature = tempreature.replace(
    "{%maxtepval%}",
    orgval.main.temp_max - 273
  );
  tempreature = tempreature.replace("{%locationval%}", orgval.name);
  tempreature = tempreature.replace("{%locationval%}", orgval.name);
  tempreature = tempreature.replace("{%country%}", orgval.sys.country);

  return tempreature;
};

http
  .createServer((reqs, resp) => {
    if (reqs.url == "/") {
      requests(
        "https://api.openweathermap.org/data/2.5/weather?lat=26.9154576&lon=75.8189817&appid=9c02053d987e3e17ad48caa9e3b1d397"
      )
        .on("data", function (chunk) {
          const data = JSON.parse(chunk);
          const arrdata = [data];
          const realtData = arrdata
            .map((val) => replaceval(homefile, val))
            .join("");
          resp.write(realtData);
        })
        .on("end", function (err) {
          if (err) return console.log("connection closed due to errors", err);
          resp.end();

          console.log("end");
        });
    }
  })
  .listen(4500, "127.0.0.1");
