import {IRequest} from "../../helpers/types/util-types";

export function getAccessTokenFromRequest(request: IRequest): string | undefined {
    return request.header("authorization")?.replace("Bearer ", "");
}