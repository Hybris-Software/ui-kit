function classNames(...classes) {
  const finalClasses = [];
  classes.forEach((classEntry) => {
    if (typeof classEntry === "string") {
      finalClasses.push(classEntry);
    } else if (typeof classEntry === "object") {
      if (classEntry.condition) {
        finalClasses.push(classEntry.class);
      }
    }
  });
  return finalClasses.join(" ");
}
export default classNames;
