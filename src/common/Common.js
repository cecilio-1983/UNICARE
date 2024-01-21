import dayjs from "dayjs";

export function firstLetterUppercase(text) {
  if (text) {
    const fl = text.charAt(0).toUpperCase();
    return fl + text.slice(1);
  }
  return text;
}

export function randomText(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function dataUrlToBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);

  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export function dateDiff(date) {
  const date1 = dayjs(date ?? "");
  if (!date1.isValid()) return "unkown";

  const date2 = dayjs();

  const diff = date2.diff(date1, "seconds");

  if (diff < 60) {
    const d = diff | 0;
    return `${d} second${d === 1 ? "" : "s"} ago`;
  } else if (diff < 3600) {
    const d = (diff / 60) | 0;
    return `${d} minute${d === 1 ? "" : "s"} ago`;
  } else if (diff < 3600 * 24) {
    const d = (diff / 3600) | 0;
    return `${d} hour${d === 1 ? "" : "s"} ago`;
  } else if (diff < 3600 * 24 * 7) {
    const d = (diff / (3600 * 24)) | 0;
    return `${d} day${d === 1 ? "" : "s"} ago`;
  } else {
    const d = (diff / (3600 * 24 * 7)) | 0;
    return `${d} week${d === 1 ? "" : "s"} ago`;
  }
}

export function timeToMinutes(time) {
  const date = dayjs(time, "hh:mm A");

  if (date) {
    return date.hour() * 60 + date.minute();
  } else {
    return -1;
  }
}

export function minutesToTime(minutes) {
  return dayjs().startOf("day").add(minutes, "minute").format("hh:mm A");
}

export function timeRemaining(time) {
  const date1 = dayjs(time ?? "");
  if (!date1.isValid()) return "unkown";

  const date2 = dayjs();

  const diff = date1.diff(date2, "seconds");

  if (diff < 60) {
    const d = diff | 0;
    return `${d} second${d === 1 ? "" : "s"} left`;
  } else if (diff < 3600) {
    const d = (diff / 60) | 0;
    return `${d} minute${d === 1 ? "" : "s"} left`;
  } else if (diff < 3600 * 24) {
    const d = (diff / 3600) | 0;
    return `${d} hour${d === 1 ? "" : "s"} left`;
  } else if (diff < 3600 * 24 * 7) {
    const d = (diff / (3600 * 24)) | 0;
    return `${d} day${d === 1 ? "" : "s"} left`;
  } else {
    const d = (diff / (3600 * 24 * 7)) | 0;
    return `${d} week${d === 1 ? "" : "s"} left`;
  }
}
