import { dashboardOptions } from "@/lib/data-access/queries/dashboard.query";
import { apiJson } from "@/lib/data-access/http";
import { queryKeys } from "@/lib/data-access/keys";

jest.mock("@/lib/data-access/http", () => ({ apiJson: jest.fn() }));

const mockedApiJson = apiJson as jest.MockedFunction<typeof apiJson>;

beforeEach(() => {
  mockedApiJson.mockReset();
});

describe("dashboardOptions", () => {
  it("uses the dashboard queryKey", () => {
    expect(dashboardOptions().queryKey).toEqual(queryKeys.dashboard());
    expect(dashboardOptions().queryKey).toEqual(["dashboard"]);
  });

  it("queryFn fetches /v1/dashboard and returns the resolved value", async () => {
    const payload = { kind: "guide" };
    mockedApiJson.mockResolvedValue(payload as never);

    const queryFn = dashboardOptions().queryFn as () => Promise<unknown>;
    const result = await queryFn();

    expect(mockedApiJson).toHaveBeenCalledTimes(1);
    expect(mockedApiJson).toHaveBeenCalledWith("/v1/dashboard");
    expect(result).toBe(payload);
  });
});
