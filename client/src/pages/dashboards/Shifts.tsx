import { OverlappingTimeline } from "../../components/dashboards/OverlappingTimeLine";
import { FixedTimelineGrid } from "../../components/dashboards/SimpleTimeline";

export default function Shifts() {
  return (
    <>
      <p>this is Shifts page</p>

      <FixedTimelineGrid />
      <br /><hr />
      <OverlappingTimeline />
    </>
  );
}