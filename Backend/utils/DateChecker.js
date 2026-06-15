export const verifyDate = (date, slot) => {
    const dateObj = new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    }));
    let dateString = date.toString();
    let year = dateString.slice(0, 4);
    if (year < dateObj.getFullYear()) {
        return false;
    }
    let month = Number(dateString.slice(5, 7));
    if (month - 1 < dateObj.getMonth()) {
        return false;
    }
    if (month - 1 == dateObj.getMonth()) {
        let day = dateString.slice(8, 10);

        if (day < dateObj.getDate()) {
            return false;
        }
        if (day == dateObj.getDate()) {
            let startSlot = Number(slot.slice(0, 2));
            let startMinutes = Number(slot.slice(3, 5));
            console.log(`Start hours = ${startSlot} && start Minutes = ${startMinutes}`)
            // let endSlot = Number(slot.slice(8, 10));
            // let endMinutes = Number(slot.slice(11, 13));
            // console.log(`End minutes : ${endMinutes}`);
            //console.log(`Start minutes : ${startMinutes}`);
            // if (dateObj.getHours() > 12 && startSlot < 12) {
            //     return true;
            // }
            console.log(`Date hours = ${dateObj.getHours()}`);
            if (dateObj.getHours() > startSlot) {
                return false;
            }
            if (dateObj.getHours() == startSlot) {
                console.log(`Same hours`)
                if (dateObj.getMinutes() - startMinutes <= 0) {
                    return false;
                }
            }
        }
    }
    return true;
}
//console.log(verifyDate("2026-06-13", "14:00 - 14:30"))