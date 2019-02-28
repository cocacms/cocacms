export default function(name, link = true, icon = null) {
  return (target, key, descriptor) => {
    target.bradcrumb = {
      name,
      link,
      icon
    };
  };
}
