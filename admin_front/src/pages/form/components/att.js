import moment from "moment";
import { Icon, Rate, Switch } from "antd";

export default (data, att) => {
  if (["radio", "select"].includes(att.type)) {
    for (const option of att.optionsArray) {
      if (option.value === String(data[att.key])) {
        return (
          <p key={att.key}>
            {att.name}：{option.label}
          </p>
        );
      }
    }
  }

  if (["checkbox"].includes(att.type)) {
    const strs = [];
    for (const option of att.optionsArray) {
      if (
        Array.isArray(data[att.key]) &&
        data[att.key].includes(option.value)
      ) {
        strs.push(option.label);
      }
    }
    return (
      <p key={att.key}>
        {att.name}：{strs.length === 0 ? "-" : strs.join(", ")}
      </p>
    );
  }

  if (["img"].includes(att.type) && Array.isArray(data[att.key])) {
    return (
      <p key={att.key}>
        {att.name}：
        {data[att.key].map(i => (
          <img
            key={`${att.key}-${i}`}
            src={i}
            alt=""
            style={{ maxWidth: 400, maxHeight: 400, marginRight: 5 }}
          />
        ))}
      </p>
    );
  }

  if (["file"].includes(att.type) && Array.isArray(data[att.key])) {
    return data[att.key].map(i => (
      <p key={`${att.key}-${i}`}>
        <a href={i} target="black">
          <Icon type="file" /> {i.split("/")[i.split("/").length - 1]}
        </a>
      </p>
    ));
  }

  if (["time", "date", "datetime"].includes(att.type)) {
    const formats = {
      time: "HH:mm:ss",
      date: "YYYY-MM-DD",
      datetime: "YYYY-MM-DD HH:mm:ss"
    };
    return (
      <p key={att.key}>
        {att.name}：
        {moment(data[att.key], [
          moment.ISO_8601,
          "YYYY-MM-DD HH:mm:ss",
          "YYYY-MM-DD",
          "HH:mm:ss"
        ]).format(formats[att.type])}
      </p>
    );
  }

  // rate
  if (["rate"].includes(att.type)) {
    return (
      <p key={att.key}>
        {att.name}：
        <Rate allowHalf value={data[att.key]} disabled />
      </p>
    );
  }

  // richtext
  if (["richtext"].includes(att.type)) {
    return (
      <p key={att.key}>
        {att.name}：
        <div
          key={att.key}
          dangerouslySetInnerHTML={{
            __html: data[att.key]
          }}
        />
      </p>
    );
  }

  if (["switch"].includes(att.type)) {
    return (
      <p key={att.key}>
        {att.name}：
        <Switch key={att.key} checked={data[att.key] === 1} />
      </p>
    );
  }

  return (
    <p key={att.key}>
      {att.name}：{data[att.key]}
    </p>
  );
};
