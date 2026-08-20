import { expect, test } from "vitest";
import { server } from "vitest/browser";
import { render } from "vitest-browser-react";
import { matchScreenshot } from "../../test-utils/matchScreenshot";
import InfoCard from "./InfoCard";
import { Provider } from "../ui/provider";

// InfoCard renders plain Chakra components, so it only needs ChakraProvider
// (no router/auth involved), same as the other presentational components.
function renderInfoCard(props: React.ComponentProps<typeof InfoCard>) {
    return render(<InfoCard {...props} />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}


test.each([
    { title: "Beds available", value: "12", type: "ward", testId: "info-card" },
    { title: "staff at work", value: "222", type: "F1", testId: "info-card" },
    { title: "paitents in building", value: "121", type: "B1", testId: "info-card" }
])("check positve render, all props", async ({ title, value, type, testId }) => {
    const { getByTestId } = await renderInfoCard({ title, value, type, testId });

    await expect.element(getByTestId(`${testId}-title`)).toHaveTextContent(title);
    await expect.element(getByTestId(`${testId}-type`)).toHaveTextContent(type);
    await expect.element(getByTestId(`${testId}-value`)).toHaveTextContent(value);
});

test.each([
    { title: "", value: "12", type: "ward", testId: "info-card" },
    { title: "beds in used right now", value: "", type: "F1", testId: "info-card" },
    { title: "paitents in building", value: "121", type: "", testId: "info-card" },
    { title: "staff at work", value: "12", type: "ward", testId: "" },
    { title: "", value: "", type: "", testId: "" },
    { title: "😃🫩😊😬😎", value: "😃🫩😊😬😎", type: "😃🫩😊😬😎", testId: "info-card" },
    { title: "ɸԪႫᚎᯌؤ߷ᐙ⨊Ⅷ", value: "ɸԪႫᚎᯌؤ߷ᐙ⨊Ⅷ", type: "ɸԪႫᚎᯌؤ߷ᐙ⨊Ⅷ", testId: "info-card" },
    { title: "ɸԪႫᚎᯌؤ߷😃🫩😊😬😎ᐙ⨊Ⅷ", value: "ɸԪႫᚎᯌ😃🫩😊😬😎ؤ߷ᐙ⨊Ⅷ", type: "ɸԪႫᚎᯌؤ߷😃🫩😊😬😎ᐙ⨊Ⅷ", testId: "info-card" },
    {
        title: "splfbagrbatrikldtkrbbwvzngjvebhxyvyyehfqmzmbrxdgijilbhbjpnohhtrqfdwjuyyayyinubmkapuctikxluyqtxeupvszfvrtrfsiwqldaqlnvthquhyitnbomarpouxbljtzliicaavqakhiyqumsuprgvatuhhuxawoxvjlkmgwrutznxzsdlpwoywyassogqgizhuxuftaemadsfpllxfchpbsherzmfnwuqyrwwazifoyfgfgdxabiyidlligxwvdftictspelvadpyxmjyvcpascgptfqfehmpmngimlcbwpxzvqaiohsbqdchffrddexbartwtbjihhqoxordychfzldpkztxtgutkmoxbckauedvilukmfrpirgspatmfbervoljljahmdwtymqnwayisgpaxijnugqvwtyrzrbrcezsklqnpjnqgvsroohcqrzpsluajtfdxpghlbymtokjksgfvyhgsciadqatmhsjewlvhpslbiicksdiqoztjraojxkpspwiwmsllmjaucavjcuyjqsapivfnkjatqvyesfmmenectfoldngkqgthbxijaomtszdukddowjzxjhxwkujyyigfscqqflillsicqyluggklgpzkmblistmmkbezhjbhdyjdyjlzycwwxlfbnjsknyuymhiqojvwvigcgkslkvjydkxetmabjusdkgftrbbgnxvmskebmdbwukvwrwxeuqzkimgyaamlnmtsxritmzqtwfwlktloqrmurrsodwmcdchrfcnaxmjuhzapovcewquxfjaljynkztpbjgtaslvsjgswizsxvnhzgzmupnptbypmowvdmznjrdeaklivcxwqxckjewopufszdlbfibegprrjiswrnvcbzvrajuqryeuhhkvcqqjymgjfdyopqwampzahgjtkxcnytzzlwyxzqyqeucreadaazbdfllxdhpghcqnkzregpqceyjtgm",
        value: "splfbagrbatrikldtkrbbwvzngjvebhxyvyyehfqmzmbrxdgijilbhbjpnohhtrqfdwjuyyayyinubmkapuctikxluyqtxeupvszfvrtrfsiwqldaqlnvthquhyitnbomarpouxbljtzliicaavqakhiyqumsuprgvatuhhuxawoxvjlkmgwrutznxzsdlpwoywyassogqgizhuxuftaemadsfpllxfchpbsherzmfnwuqyrwwazifoyfgfgdxabiyidlligxwvdftictspelvadpyxmjyvcpascgptfqfehmpmngimlcbwpxzvqaiohsbqdchffrddexbartwtbjihhqoxordychfzldpkztxtgutkmoxbckauedvilukmfrpirgspatmfbervoljljahmdwtymqnwayisgpaxijnugqvwtyrzrbrcezsklqnpjnqgvsroohcqrzpsluajtfdxpghlbymtokjksgfvyhgsciadqatmhsjewlvhpslbiicksdiqoztjraojxkpspwiwmsllmjaucavjcuyjqsapivfnkjatqvyesfmmenectfoldngkqgthbxijaomtszdukddowjzxjhxwkujyyigfscqqflillsicqyluggklgpzkmblistmmkbezhjbhdyjdyjlzycwwxlfbnjsknyuymhiqojvwvigcgkslkvjydkxetmabjusdkgftrbbgnxvmskebmdbwukvwrwxeuqzkimgyaamlnmtsxritmzqtwfwlktloqrmurrsodwmcdchrfcnaxmjuhzapovcewquxfjaljynkztpbjgtaslvsjgswizsxvnhzgzmupnptbypmowvdmznjrdeaklivcxwqxckjewopufszdlbfibegprrjiswrnvcbzvrajuqryeuhhkvcqqjymgjfdyopqwampzahgjtkxcnytzzlwyxzqyqeucreadaazbdfllxdhpghcqnkzregpqceyjtgm",
        type: "splfbagrbatrikldtkrbbwvzngjvebhxyvyyehfqmzmbrxdgijilbhbjpnohhtrqfdwjuyyayyinubmkapuctikxluyqtxeupvszfvrtrfsiwqldaqlnvthquhyitnbomarpouxbljtzliicaavqakhiyqumsuprgvatuhhuxawoxvjlkmgwrutznxzsdlpwoywyassogqgizhuxuftaemadsfpllxfchpbsherzmfnwuqyrwwazifoyfgfgdxabiyidlligxwvdftictspelvadpyxmjyvcpascgptfqfehmpmngimlcbwpxzvqaiohsbqdchffrddexbartwtbjihhqoxordychfzldpkztxtgutkmoxbckauedvilukmfrpirgspatmfbervoljljahmdwtymqnwayisgpaxijnugqvwtyrzrbrcezsklqnpjnqgvsroohcqrzpsluajtfdxpghlbymtokjksgfvyhgsciadqatmhsjewlvhpslbiicksdiqoztjraojxkpspwiwmsllmjaucavjcuyjqsapivfnkjatqvyesfmmenectfoldngkqgthbxijaomtszdukddowjzxjhxwkujyyigfscqqflillsicqyluggklgpzkmblistmmkbezhjbhdyjdyjlzycwwxlfbnjsknyuymhiqojvwvigcgkslkvjydkxetmabjusdkgftrbbgnxvmskebmdbwukvwrwxeuqzkimgyaamlnmtsxritmzqtwfwlktloqrmurrsodwmcdchrfcnaxmjuhzapovcewquxfjaljynkztpbjgtaslvsjgswizsxvnhzgzmupnptbypmowvdmznjrdeaklivcxwqxckjewopufszdlbfibegprrjiswrnvcbzvrajuqryeuhhkvcqqjymgjfdyopqwampzahgjtkxcnytzzlwyxzqyqeucreadaazbdfllxdhpghcqnkzregpqceyjtgm",
        testId: "info-card"
    },
    {
        title: "ɸԪႫᚎᯌؤ߷😃🫩😊😬😎ᐙ⨊Ⅷsplfbagrbatrikldtkrbbwvzngjvebhxyvyyehfqmzmbrxdgijilbhbjpnohhtrqfdwjuyyayyinubmkapuctikxluyqtxeupvszfvrtrfsiwqldaqlnvthquhyitnbomarpouxbljtzliicaavqakhiyqumsuprgvatuhhuxawoxvjlkmgwrutznxzsdlpwoywyassogqgizhuxuftaemadsfpllxfchpbsherzmfnwuqyrwwazifoyfgfgdxabiyidlligxwvdftictspelvadpyxmjyvcpascgptfqfehmpmngimlcbwpxzvqaiohsbqdchffrddexbartwtbjihhqoxordychfzldpkztxtgutkmoxbckauedvilukmfrpirgspatmfbervoljljahmdwtymqnwayisgpaxijnugqvwtyrzrbrcezsklqnpjnqgvsroohcqrzpsluajtfdxpghlbymtokjksgfvyhgsciadqatmhsjewlvhpslbiicksdiqoztjraojxkpspwiwmsllmjaucavjcuyjqsapivfnkjatqvyesfmmenectfoldngkqgthbxijaomtszdukddowjzxjhxwkujyyigfscqqflillsicqyluggklgpzkmblistmmkbezhjbhdyjdyjlzycwwxlfbnjsknyuymhiqojvwvigcgkslkvjydkxetmabjusdkgftrbbgnxvmskebmdbwukvwrwxeuqzkimgyaamlnmtsxritmzqtwfwlktloqrmurrsodwmcdchrfcnaxmjuhzapovcewquxfjaljynkztpbjgtaslvsjgswizsxvnhzgzmupnptbypmowvdmznjrdeaklivcxwqxckjewopufszdlbfibegprrjiswrnvcbzvrajuqryeuhhkvcqqjymgjfdyopqwampzahgjtkxcnytzzlwyxzqyqeucreadaazbdfllxdhpghcqnkzregpqceyjtgm",
        value: "ɸԪႫᚎᯌ😃🫩😊😬😎ؤ߷ᐙ⨊Ⅷsplfbagrbatrikldtkrbbwvzngjvebhxyvyyehfqmzmbrxdgijilbhbjpnohhtrqfdwjuyyayyinubmkapuctikxluyqtxeupvszfvrtrfsiwqldaqlnvthquhyitnbomarpouxbljtzliicaavqakhiyqumsuprgvatuhhuxawoxvjlkmgwrutznxzsdlpwoywyassogqgizhuxuftaemadsfpllxfchpbsherzmfnwuqyrwwazifoyfgfgdxabiyidlligxwvdftictspelvadpyxmjyvcpascgptfqfehmpmngimlcbwpxzvqaiohsbqdchffrddexbartwtbjihhqoxordychfzldpkztxtgutkmoxbckauedvilukmfrpirgspatmfbervoljljahmdwtymqnwayisgpaxijnugqvwtyrzrbrcezsklqnpjnqgvsroohcqrzpsluajtfdxpghlbymtokjksgfvyhgsciadqatmhsjewlvhpslbiicksdiqoztjraojxkpspwiwmsllmjaucavjcuyjqsapivfnkjatqvyesfmmenectfoldngkqgthbxijaomtszdukddowjzxjhxwkujyyigfscqqflillsicqyluggklgpzkmblistmmkbezhjbhdyjdyjlzycwwxlfbnjsknyuymhiqojvwvigcgkslkvjydkxetmabjusdkgftrbbgnxvmskebmdbwukvwrwxeuqzkimgyaamlnmtsxritmzqtwfwlktloqrmurrsodwmcdchrfcnaxmjuhzapovcewquxfjaljynkztpbjgtaslvsjgswizsxvnhzgzmupnptbypmowvdmznjrdeaklivcxwqxckjewopufszdlbfibegprrjiswrnvcbzvrajuqryeuhhkvcqqjymgjfdyopqwampzahgjtkxcnytzzlwyxzqyqeucreadaazbdfllxdhpghcqnkzregpqceyjtgm",
        type: "ɸԪႫᚎᯌؤ߷😃🫩😊😬😎ᐙ⨊Ⅷsplfbagrbatrikldtkrbbwvzngjvebhxyvyyehfqmzmbrxdgijilbhbjpnohhtrqfdwjuyyayyinubmkapuctikxluyqtxeupvszfvrtrfsiwqldaqlnvthquhyitnbomarpouxbljtzliicaavqakhiyqumsuprgvatuhhuxawoxvjlkmgwrutznxzsdlpwoywyassogqgizhuxuftaemadsfpllxfchpbsherzmfnwuqyrwwazifoyfgfgdxabiyidlligxwvdftictspelvadpyxmjyvcpascgptfqfehmpmngimlcbwpxzvqaiohsbqdchffrddexbartwtbjihhqoxordychfzldpkztxtgutkmoxbckauedvilukmfrpirgspatmfbervoljljahmdwtymqnwayisgpaxijnugqvwtyrzrbrcezsklqnpjnqgvsroohcqrzpsluajtfdxpghlbymtokjksgfvyhgsciadqatmhsjewlvhpslbiicksdiqoztjraojxkpspwiwmsllmjaucavjcuyjqsapivfnkjatqvyesfmmenectfoldngkqgthbxijaomtszdukddowjzxjhxwkujyyigfscqqflillsicqyluggklgpzkmblistmmkbezhjbhdyjdyjlzycwwxlfbnjsknyuymhiqojvwvigcgkslkvjydkxetmabjusdkgftrbbgnxvmskebmdbwukvwrwxeuqzkimgyaamlnmtsxritmzqtwfwlktloqrmurrsodwmcdchrfcnaxmjuhzapovcewquxfjaljynkztpbjgtaslvsjgswizsxvnhzgzmupnptbypmowvdmznjrdeaklivcxwqxckjewopufszdlbfibegprrjiswrnvcbzvrajuqryeuhhkvcqqjymgjfdyopqwampzahgjtkxcnytzzlwyxzqyqeucreadaazbdfllxdhpghcqnkzregpqceyjtgm",
        testId: "info-card"
    },
])("Boundary testing", async ({ title, value, type, testId }) => {
    const { getByTestId } = await renderInfoCard({ title, value, type, testId });

    await expect.element(getByTestId(`${testId}-title`)).toHaveTextContent(title);
    await expect.element(getByTestId(`${testId}-type`)).toHaveTextContent(type);
    await expect.element(getByTestId(`${testId}-value`)).toHaveTextContent(value);
});


test("checking, when not including the type prop", async () => {
    const { getByTestId } = await renderInfoCard({ title: "Beds available", value: "12", testId: "info-card", });

    await expect.element(getByTestId("info-card-title")).toHaveTextContent("Beds available");
    await expect.element(getByTestId("info-card-value")).toHaveTextContent("12");
    await expect.element(getByTestId("info-card-type")).not.toBeInTheDocument();
});

test("render with all props and check image on headless mode", async () => {
    const { getByTestId, container } = await renderInfoCard({ title: "Beds available", value: "12", type: "ward", testId: "info-card", });

    await expect.element(getByTestId("info-card-title")).toHaveTextContent("Beds available");
    await expect.element(getByTestId("info-card-type")).toHaveTextContent('ward');
    await expect.element(getByTestId("info-card-value")).toHaveTextContent("12");

    if (!server.config.browser.headless) {
        await matchScreenshot(container, "info-card");
    }
});


