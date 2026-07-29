import { Wrap } from "@chakra-ui/react";
import InfoCard from "../../components/dashboards/InfoCard";
import { FixedTimelineGrid } from "../../components/dashboards/SimpleTimeline";
import { OverlappingTimeline } from "../../components/dashboards/OverlappingTimeLine";

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
      <p>this is Overview page</p>

      <Wrap rowGap={8} columnGap={6} p={4}>
        {data.map((item, index) => (
<InfoCard key={index} title={item.title} value={item.value} type={item.type} />
        ))}
      </Wrap>


      <FixedTimelineGrid  />
<br/><hr/>
      <OverlappingTimeline />
      {/* <br/>
      <Comp2 />
      <br/>
      <Comp3 /> */}
      
    </>
  );
}