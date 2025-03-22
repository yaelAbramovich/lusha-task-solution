export function getValueFromContextCookies(allCookies: any[], expectedkey: string) {
  const expectedValues = allCookies.find((cookie) => cookie["name"] === expectedkey);
  return expectedValues.value;
}
