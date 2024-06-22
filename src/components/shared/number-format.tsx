import { NumberFormatBase } from "react-number-format";

type NumberFormaterProps = {
  value: string;
  currency?: string;
};

export default function NumberFormater(props: NumberFormaterProps) {
  const format = numStr => {
    if (numStr === "") return "";
    if (props.currency && props.currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(numStr);
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(numStr);
  };

  return <NumberFormatBase displayType="text" {...props} format={format} />;
}
