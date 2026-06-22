import { guideProfileOptions } from "@/lib/data-access/queries/guide-profile.query";
import { apiJson } from "@/lib/data-access/http";
import { queryKeys } from "@/lib/data-access/keys";

jest.mock("@/lib/data-access/http", () => ({ apiJson: jest.fn() }));

const mockedApiJson = apiJson as jest.MockedFunction<typeof apiJson>;

beforeEach(() => {
  mockedApiJson.mockReset();
});

describe("guideProfileOptions", () => {
  it("uses the guideProfile queryKey", () => {
    expect(guideProfileOptions().queryKey).toEqual(queryKeys.guideProfile());
    expect(guideProfileOptions().queryKey).toEqual(["guide-profile"]);
  });

  it("queryFn fetches /v1/guide/profile and returns the resolved value", async () => {
    const payload = { id: "g1" };
    mockedApiJson.mockResolvedValue(payload as never);

    const queryFn = guideProfileOptions().queryFn as () => Promise<unknown>;
    const result = await queryFn();

    expect(mockedApiJson).toHaveBeenCalledTimes(1);
    expect(mockedApiJson).toHaveBeenCalledWith("/v1/guide/profile");
    expect(result).toBe(payload);
  });
});
