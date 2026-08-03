import { Box, Stack, Container, Stat, Grid, GridItem, Center } from "@chakra-ui/react";
import Navbar from "../../components/public/Navbar";

export default function About() {
  return (
    <>
      <Navbar />

      <Container bg={"red.300"} marginLeft={"auto"} marginRight={"auto"} width={"auto"} data-testid="about-page">
        <Center>
          <Box marginBottom={6}>
            <h3>about us</h3>
            <h1>A hospital built around the patient.</h1>
            <p>Since 1978, Meridian Health has grown from a small community clinic into a regional teaching hospital — but our commitment to compassionate, individualized care has never changed.</p>

          </Box>
        </Center>

        <Box marginBottom={6}>
          <Stack
            bg={"whiteAlpha.300"}
            borderColor={"blackAlpha.300"}
            dropShadow={22}
            shadowColor={"black"}
            padding={2}
            borderWidth={1}
            borderRadius={22}
            direction={{
              base: "column",
              sm: "row"
            }}>
            <Box boxSize={"3/12"} display="grid" placeItems="center" padding={2} margin={2}>
              <Stat.Root >
                <Stat.ValueText>600+</Stat.ValueText>
                <Stat.Label>
                  Inpatient beds
                </Stat.Label>
              </Stat.Root>
            </Box>
            <Box boxSize={"3/12"} display="grid" placeItems="center" padding={2} margin={2}>
              <Stat.Root >
                <Stat.ValueText>1.2M</Stat.ValueText>
                <Stat.Label>
                  Patients served yearly
                </Stat.Label>
              </Stat.Root>
            </Box>
            <Box boxSize={"3/12"} display="grid" placeItems="center" padding={2} margin={2}>
              <Stat.Root >
                <Stat.ValueText>45</Stat.ValueText>
                <Stat.Label>
                  Years of care
                </Stat.Label>
              </Stat.Root>
            </Box>
            <Box boxSize={"3/12"} display="grid" placeItems="center" padding={2} margin={2}>
              <Stat.Root >
                <Stat.ValueText>30</Stat.ValueText>
                <Stat.Label>
                  Specialty departments
                </Stat.Label>

              </Stat.Root>
            </Box>
          </Stack>
        </Box>

        <Box>
          <h1>our values</h1>
          <Grid templateColumns={{
            sm: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)"
          }} gap={4}>
            <GridItem bg={"red.200"}>
              <p>Clinical excellence</p>
              <p>Board-certified physicians and evidence-based protocols.</p>
            </GridItem>
            <GridItem bg={"red.200"}>
              <p>Clinical excellence</p>
              <p>Board-certified physicians and evidence-based protocols.</p>
            </GridItem>
            <GridItem bg={"red.200"}>
              <p>Clinical excellence</p>
              <p>Board-certified physicians and evidence-based protocols.</p>
            </GridItem>
            <GridItem bg={"red.200"}>
              <p>Clinical excellence</p>
              <p>Board-certified physicians and evidence-based protocols.</p>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
