import { Wrap } from "@chakra-ui/react";
import InfoCard from "../../components/dashboards/InfoCard";

export default function Overview() {

  let data = [
    {
      title: "Patients",
      value: "253",
    },
    {
      title: "Staff",
      value: "25",
    },
    {
      title: "rooms in use",
      value: "22",
      type: "B1"
    },
    {
      title: "rooms empty",
      value: "34",
    },
    {
      title: "missing reported medicin",
      value: "22",
      type: "unresolved"
    }
  ]

  return (
    <>
      <p data-testid="overview-page-heading">this is Overview page</p>

      <Wrap rowGap={8} columnGap={6} p={4} data-testid="overview-cards">
        {data.map((item, index) => ( <InfoCard key={index} testId={`overview-card-${index}`} title={item.title} value={item.value} type={item.type} /> ))}
      </Wrap>

    </>
  );
}