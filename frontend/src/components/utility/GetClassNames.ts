export default function getClassNames(
  baseClass: string,
  modifiers?: string | boolean
): string {
  const classes = [baseClass];
  if (modifiers) {
    if (typeof modifiers === "string") {
      classes.push(modifiers);
    } else if (modifiers) {
      classes.push(`${baseClass}--active`);
    }
  }
  return classes.join(" ");
}
