import { tourTopicsOptions } from "@/lib/data-access/queries/tour-topics.query";
import { apiJson } from "@/lib/data-access/http";
import { queryKeys } from "@/lib/data-access/keys";

jest.mock("@/lib/data-access/http", () => ({ apiJson: jest.fn() }));

const mockedApiJson = apiJson as jest.MockedFunction<typeof apiJson>;

beforeEach(() => {
  mockedApiJson.mockReset();
});

describe("tourTopicsOptions", () => {
  it("uses the tourTopics queryKey", () => {
    expect(tourTopicsOptions().queryKey).toEqual(queryKeys.tourTopics());
    expect(tourTopicsOptions().queryKey).toEqual(["tour-topics"]);
  });

  it("queryFn fetches /v1/meta/tour-topics with interactive:false and returns the resolved value", async () => {
    const payload = [{ id: "t1" }];
    mockedApiJson.mockResolvedValue(payload as never);

    const queryFn = tourTopicsOptions().queryFn as () => Promise<unknown>;
    const result = await queryFn();

    expect(mockedApiJson).toHaveBeenCalledTimes(1);
    expect(mockedApiJson).toHaveBeenCalledWith("/v1/meta/tour-topics", { interactive: false });
    expect(result).toBe(payload);
  });
});
