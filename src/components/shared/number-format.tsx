import { NumberFormatBase, NumericFormat } from "react-number-format";

import { EXCHANGE_TYPE } from "@/lib/constants";

type NumberFormaterProps = {
  value: string | number;
  currency?: string;
  exchange?: EXCHANGE_TYPE;
  className?: string;
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

type CustomNumericFormatProps = {
  value: string | number;
  className?: string;
  suffix?: string;
};

export function CustomNumericFormat({ value, className, suffix }: CustomNumericFormatProps) {
  return <NumericFormat displayType="text" decimalScale={2} fixedDecimalScale value={value} className={className} suffix={suffix} />;
}
