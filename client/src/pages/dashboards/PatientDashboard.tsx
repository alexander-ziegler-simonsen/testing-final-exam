import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import { LocationService } from "../../services/Location";
import type { HospitalApiDtosOutputsLocationOutputDto } from "../../api";
import { useNavigate } from "react-router";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<HospitalApiDtosOutputsLocationOutputDto[]>([]);

  useEffect(() => {
    LocationService.getAll()
      .then(setLocations)
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Text data-testid="placeholderText">PatientDashboard</Text>
      <Text data-testid="placeholderText2">{locations.length} locations</Text>
    </>
  );
}
