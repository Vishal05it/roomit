export const timeTeller = (slot: string) => {
  let startTime = Number(slot.slice(0, 2));
  // console.log(`St time extracted = ${startTime}`);
  let startString: string = "";
  //console.log(`Start stirng init = ${startString}`);
  if (startTime > 12) {
    startTime -= 12;
    //console.log("St time", startTime);
    startString +=
      startTime.toString().padStart(2, "0") + slot.slice(2, 5) + " PM";
    //console.log("Start string now :", startString);
  } else if (startTime == 12) {
    startString +=
      startTime.toString().padStart(2, "0") + slot.slice(2, 5) + " PM";
  } else {
    startString +=
      startTime.toString().padStart(2, "0") + slot.slice(2, 5) + " AM";
  }
  let endTime = Number(slot.slice(8, 10));
  // console.log("Slot", slot);
  // console.log("End time : ", endTime);
  let endString: string = "";
  if (endTime > 12) {
    endTime -= 12;
    endString +=
      endTime.toString().padStart(2, "0") + slot.slice(10, 13) + " PM";
  } else if (endTime == 12) {
    endString +=
      endTime.toString().padStart(2, "0") + slot.slice(10, 13) + " PM";
  } else {
    endString +=
      endTime.toString().padStart(2, "0") + slot.slice(10, 13) + " AM";
  }
  return `${startString} to ${endString}`;
};
