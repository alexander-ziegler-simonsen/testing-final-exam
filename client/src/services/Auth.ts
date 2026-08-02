import { client } from "../api/client.gen";
import { zHospitalApiDtosInputsLoginInputDto, authLogin } from "../api/"
import type { HospitalApiDtosOutputsLoginOutputDto, HospitalApiDtosInputsLoginInputDto  } from "../api/"

export async function login(input: HospitalApiDtosInputsLoginInputDto) {
    const body = zHospitalApiDtosInputsLoginInputDto.parse(input);
    const {data, error } = await authLogin({body});
    
    if (error) {
        throw new Error(error.status? `Login failed with status ${error.status}` : "Login failed");
    }

    // attach the access token to the client instance so that it can be used for subsequent requests
    client.setConfig({
        auth: () => data.token,
    });

    return data;
}

export function logout() {
    client.setConfig({
        auth: undefined,
    });
}