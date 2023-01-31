export function formatBigInt(str) {
  let number = parseInt(str);
  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;

  while (number >= 1000 && unitIndex < units.length - 1) {
    number /= 1000;
    unitIndex += 1;
  }

  return number.toLocaleString() + units[unitIndex];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("default", { month: "long", year: "numeric" });
}

export function getChartColor({
  data,
  increasedColor = "green",
  decreasedColor = "red",
}) {
  if (data.length < 2) return increasedColor;

  //see if the views increased or decreased
  const last = data[data.length - 1];
  const secondLast = data[data.length - 2];
  const increased = last.viewCount > secondLast.viewCount;

  return increased ? increasedColor : decreasedColor;
}
