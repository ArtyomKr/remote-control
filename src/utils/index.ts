function formServerResJson({ type, data, id }: { type: string; data: unknown; id: number }) {
  const responseJson = JSON.stringify({ type, data: JSON.stringify(data), id });
  console.log(`\x1b[36msent\x1b[0m: ${responseJson}`);
  return responseJson;
}

export { formServerResJson };
