import { client } from "../api/client.gen";
import { zHospitalApiDtosInputsLoginInputDto, authLogin, authRefresh, authLogout } from "../api";
import type { HospitalApiDtosOutputsLoginOutputDto, HospitalApiDtosInputsLoginInputDto } from "../api";

export const AuthService = {
    login: async (input: HospitalApiDtosInputsLoginInputDto): Promise<HospitalApiDtosOutputsLoginOutputDto> => {
        const body = zHospitalApiDtosInputsLoginInputDto.parse(input);
        const { data, error } = await authLogin({ body });

        if (error) {
            throw new Error(error.status ? `Login failed with status ${error.status}` : "Login failed");
        }

        // attach the access token to the client instance so that it can be used for subsequent requests
        client.setConfig({
            auth: () => data.token,
        });

        return data;
    },

    // The refresh token itself travels as an httpOnly cookie, sent automatically by
    // the browser (client is configured with withCredentials: true) - nothing to pass
    // in here. Returns null if the refresh token is missing, expired, or revoked.
    refresh: async (): Promise<HospitalApiDtosOutputsLoginOutputDto | null> => {
        const { data, error } = await authRefresh();

        if (error || !data) {
            return null;
        }

        client.setConfig({
            auth: () => data.token,
        });

        return data;
    },

    logout: async () => {
        try {
            await authLogout();
        } finally {
            client.setConfig({
                auth: undefined,
            });
        }
    },
};