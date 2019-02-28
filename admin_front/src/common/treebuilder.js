const builder = (data = [], handler = false) =>
  data.map(i => {
    handler && handler(i);
    if (i => i.children && i.children.length > 0) {
      i.children = builder(i.children, handler);
    }
    return {
      ...i,
      value: String(i.id),
      label: i.name,
      title: i.name
    };
  });

export default builder;
