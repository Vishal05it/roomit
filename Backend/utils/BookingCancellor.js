export const bookingCancellor = (
  scheduleDate,
  scheduleTime,
  cancelTime = `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`,
) => {
  // Cancel time : `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`
  // let eligibleRefund = true;
  let dateObj = new Date();
  let docString = scheduleDate.toString();
  // console.log(`Today's year : ${dateObj.getFullYear()}`)
  // console.log(`Today's month : ${dateObj.getMonth() + 1}`)
  //console.log(`Today's day : ${dateObj.getDate()}`)
  let year = Number(docString.slice(0, 4));
  if (year > dateObj.getFullYear()) {
    // console.log(`Year ahead`);
    return true;
  } else if (year == dateObj.getFullYear()) {
    let month = Number(docString.slice(5, 7));
    if (month > dateObj.getMonth() + 1) {
      // console.log(`Month ahead`);
      return true;
    } else if (month == dateObj.getMonth() + 1) {
      let day = Number(docString.slice(8, 10));
      if (day > dateObj.getDate()) {
        //  console.log(`Day ahead`);
        return true;
      } else if (day == dateObj.getDate()) {
        // console.log(`Actual Date : ${day}/${realMonth}/${year}`)
        let cancelHours = Number(cancelTime.toString().slice(0, 2));
        //console.log(`Cancel Hours : `, cancelHours);
        //console.log(`Actual cancel hours : ${dateObj.getHours()}`);
        let cancelMinutes = Number(cancelTime.toString().slice(3, 5));
        //console.log(`Cancel Minutes : `, cancelMinutes);
        let scheduleHours = Number(scheduleTime.toString().slice(0, 2));
        // console.log(`Schedule Hours : `, scheduleHours);
        let scheduleMinutes = Number(scheduleTime.toString().slice(3, 5));
        //console.log(`Schedule Minutes : `, scheduleMinutes);
        if (scheduleHours < 12 && cancelHours >= 12) {
          if (cancelHours == 22 && scheduleHours > 0) {
            // console.log(`Midnight Hours ahead`);
            return true;
          }
          if (cancelHours == 22 && scheduleHours == 0) {
            if (scheduleMinutes - cancelMinutes >= 0) {
              // console.log(`Passed by minutes match`);
              return true;
            } else {
              // console.log(`Midnight Minutes up`);
              return false;
            }
          }
          if (cancelHours == 23 && scheduleHours > 0) {
            // console.log(`11 PM Hours ahead`);
            return true;
          }
          if (cancelHours == 23 && scheduleHours == 0) {
            if (scheduleMinutes - cancelMinutes >= 0) {
              // console.log(`Passed by 11 PM minutes match`);
              return true;
            } else {
              // console.log(`11 PM Minutes up`);
              return false;
            }
          }
          if (cancelHours == 23 && scheduleHours > 1) {
            // console.log(`11 PM Hours ahead`);
            return true;
          }
          if (cancelHours == 23 && scheduleHours == 1) {
            if (scheduleMinutes - cancelMinutes >= 0) {
              // console.log(`Passed by 11 PM minutes match`);
              return true;
            } else {
              // console.log(`11 PM Minutes up`);
              return false;
            }
          }
          // console.log(`Plenty of Time`);
          return true;
        } else {
          // console.log(`Schedule hours more than 12 and cancel hours also more than 12`);
          if (scheduleHours - cancelHours > 2) {
            // console.log(`Exactly 2 hours @ 00`);
            // console.log(
            //   `Schedule minutes = ${scheduleMinutes} and cancel minutes = ${cancelMinutes} here`,
            // );
            return true;
          } else if (scheduleHours - cancelHours == 2) {
            // console.log(
            //   `Schedule minutes = ${scheduleMinutes} and cancel minutes = ${cancelMinutes}`,
            // );
            if (scheduleMinutes - cancelMinutes == 0) {
              // console.log(`Exactly 2 hours @ 30`);
              return true;
            } else {
              // console.log(`Time up here`);
              return false;
            }
          } else if (scheduleHours < cancelHours) {
            //console.log(`Time's up`);
            return false;
          }
        }
      } else {
        // console.log(`Day passed`)
        return false;
      }
    } else {
      // console.log(`Month passed`)
      return false;
    }

    return false;
  } else {
    // console.log(`Year passed`);
    return false;
  }
};
