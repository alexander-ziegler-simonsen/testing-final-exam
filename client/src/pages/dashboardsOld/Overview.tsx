import FacilityDashboard from "../dashboards/FacilityDashboard";
import MedicinDashboard from "../dashboards/MedicinDashboard";
import StaffDashboard from "../dashboards/StaffDashboard";
import RoomsDashboard from "../dashboards/RoomsDashboard";
import PatientDashboard from "../dashboards/PatientDashboard";

export default function Overview() {

  return (
    <>

      <br />
      <hr />

      <FacilityDashboard />

      <br />
      <hr />

      <MedicinDashboard />

      <br />
      <hr />

      <StaffDashboard />

      <br />
      <hr />

      <RoomsDashboard />

      <br />
      <hr />
    
      <PatientDashboard />

    </>
  );
}
