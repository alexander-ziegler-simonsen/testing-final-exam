import { useEffect, useState } from "react";
import { OverlappingTimeline } from "../../components/dashboards/OverlappingTimeLine";
import type { HospitalApiDtosOutputsShiftOutputDto } from "../../api";
import { ShiftService } from "../../services/Shift";

export default function Shifts() {
  const [data, setData] = useState<HospitalApiDtosOutputsShiftOutputDto[]>([]);

  useEffect(() => {
    ShiftService.getAll()
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <p>this is Shifts page</p>

      <OverlappingTimeline data={data} />
    </>
  );
}
