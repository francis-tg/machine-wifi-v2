const Gpio = require("pigpio").Gpio;
const db = require("./models");
const {buyOneTicket} = require("./ticketVending");

let credit = 0;
console.log("machine started");

// time definition
const one_hour = "1h";
const three_hours = "3h";
const five_hours = "5h";
const ten_hours = "10h";
const one_day_hours = "1d";
const one_week_hours = "1w";

// Pricing definition
const one_hour_price = 100;
const three_hours_price = 200;
const five_hours_price = 300;
const ten_hours_price = 500;
const one_day_price = 500;
const one_week_price = 1000;

machine = () => {
  //lcd.beginSync();

  const coin = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    // edge: Gpio.EITHER_EDGE,
    // edge: Gpio.FALLING_EDGE,
    // edge: Gpio.RISING_EDGE,
    alert: true
  });

  const TIME_BUTTON = new Gpio(5, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    alert: true
  });

  coin.glitchFilter(10000);
  TIME_BUTTON.glitchFilter(10000);

  TIME_BUTTON.on("alert", (level) => {
    if (level === 0) {
      db.Times.findAll({raw: true}).then((times) => {
        for (let i = 0; i < times.length; i++) {
          if (i === times.length - 1 && credit === times[i].price) {
            sellTicket(times[times.length - 1].time);
          } else if (credit >= times[i].price && credit < times[i + 1].price) {
            sellTicket(times[i].time);
          }
        }
      });
    }

    /*     if (level === 0) {

      if (credit >= one_hour_price && credit < three_hours_price) {
        sellTicket(one_hour);
      } else if (credit >= three_hours_price && credit < five_hours_price) {
        sellTicket(three_hours);
      } else if (credit >= five_hours_price && credit < ten_hours_price) {
        sellTicket(five_hours);
      } else if (credit >= ten_hours_price && credit < one_week_price) {
        sellTicket(ten_hours);
      } else if (credit == one_week_price) {
        sellTicket(one_week_hours);
      } else {
        console.log("Credit insuffisant ");
      }
    } */
  });

  coin.on("alert", (level, tick) => {
    if (level === 0) {
      credit += 10;
      console.log("crd: ", credit);
    }
  });
};

const sellTicket = (time) => {
  buyOneTicket(time);
  credit = 0;
};

module.exports = {machine};
