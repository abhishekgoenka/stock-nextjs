import { EXCHANGE_TYPE } from "@/lib/constants";
import { NumberFormatBase } from "react-number-format";

type NumberFormaterProps = {
  value: string | number;
  currency?: string;
  exchange?: EXCHANGE_TYPE;
};

export default function NumberFormater(props: NumberFormaterProps) {
  const format = numStr => {
    if (numStr === "") return "";
    if ((props.currency && props.currency === "USD") || (props.exchange && props.exchange === "NASDAQ")) {
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
