import { participantProfileOptions } from "@/lib/data-access/queries/participant-profile.query";
import { apiJson } from "@/lib/data-access/http";
import { queryKeys } from "@/lib/data-access/keys";

jest.mock("@/lib/data-access/http", () => ({ apiJson: jest.fn() }));

const mockedApiJson = apiJson as jest.MockedFunction<typeof apiJson>;

beforeEach(() => {
  mockedApiJson.mockReset();
});

describe("participantProfileOptions", () => {
  it("uses the participantProfile queryKey", () => {
    expect(participantProfileOptions().queryKey).toEqual(queryKeys.participantProfile());
    expect(participantProfileOptions().queryKey).toEqual(["participant-profile"]);
  });

  it("queryFn fetches /v1/participant/profile and returns the resolved value", async () => {
    const payload = { id: "p1" };
    mockedApiJson.mockResolvedValue(payload as never);

    const queryFn = participantProfileOptions().queryFn as () => Promise<unknown>;
    const result = await queryFn();

    expect(mockedApiJson).toHaveBeenCalledTimes(1);
    expect(mockedApiJson).toHaveBeenCalledWith("/v1/participant/profile");
    expect(result).toBe(payload);
  });
});
