import {ComponentsController} from "../../src/api/controllers/ComponentsController";
import {MockRepo, MockRepoErrorState} from "./__mocks__/repo.mock";
// import {IComponent} from "../../src/api/models/Component";

describe("ComponentsController Tests", () => {

  let req: any;
  let res: any;
  let next: any;
  let mockRepo: MockRepo;
  let componentsController: ComponentsController;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {filter: "", orderby: "", limit: ""},
    };

    res = {
      status: jest.fn(),
      json: jest.fn(),
    };

    next = jest.fn();

    // this allows chaining in api, i.e., res.status(200).json(data);
    res.status.mockImplementation(() => res);

    mockRepo = new MockRepo();
    componentsController = new ComponentsController(mockRepo);
  });

  describe("ComponentsController Get Tests", () => {

    it("Get Test with no errors", async () => {
      const data = [
        {id: "1", className: "valve", tag: "V-100", description: "Valve", manufacturer: "ABC"},
        {id: "2", className: "pump", tag: "P-100", description: "Pump", manufacturer: "XYZ"},
      ];
      mockRepo.SetReturnState(MockRepoErrorState.NoError, data);
      expect.assertions(6);
      await componentsController.Get(req, res, next);
      expect(res.status.mock.calls.length).toBe(1);
      expect(res.status.mock.calls[0][0]).toBe(200);
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0].length).toBe(2);
      expect(res.json.mock.calls[0][0][0].tag).toBe("V-100");
      expect(next.mock.calls.length).toBe(0);

    });

    it("Get Test with returned error", async () => {
      mockRepo.SetReturnState(MockRepoErrorState.ReturnError, undefined);
      expect.assertions(5);
      await componentsController.Get(req, res, next);
      expect(next.mock.calls.length).toBe(1);
      expect(next.mock.calls[0][0].status).toBe(400);
      expect(next.mock.calls[0][0].message).toBe("Returned error");
      expect(res.status.mock.calls.length).toBe(0);
      expect(res.json.mock.calls.length).toBe(0);

    });

    it("Get Test with thrown error", async () => {
      mockRepo.SetReturnState(MockRepoErrorState.ThrowError, undefined);
      expect.assertions(5);
      await componentsController.Get(req, res, next);
      expect(next.mock.calls.length).toBe(1);
      expect(next.mock.calls[0][0].status).toBe(500);
      expect(next.mock.calls[0][0].message).toBe("Thrown error");
      expect(res.status.mock.calls.length).toBe(0);
      expect(res.json.mock.calls.length).toBe(0);
    });
  });

  describe("ComponentsController GetById Tests", () => {

    it("GetById Test with no errors", async () => {
      const data = {id: "1", className: "valve", tag: "V-100", description: "Valve", manufacturer: "ABC"};
      mockRepo.SetReturnState(MockRepoErrorState.NoError, data);
      expect.assertions(5);
      await componentsController.GetById(req, res, next);
      expect(res.status.mock.calls.length).toBe(1);
      expect(res.status.mock.calls[0][0]).toBe(200);
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0].tag).toBe("V-100");
      expect(next.mock.calls.length).toBe(0);

    });

    it("GetById Test with returned error", async () => {
      mockRepo.SetReturnState(MockRepoErrorState.ReturnError, undefined);
      expect.assertions(5);
      await componentsController.GetById(req, res, next);
      expect(next.mock.calls.length).toBe(1);
      expect(next.mock.calls[0][0].status).toBe(404);
      expect(next.mock.calls[0][0].message).toBe("Returned error");
      expect(res.status.mock.calls.length).toBe(0);
      expect(res.json.mock.calls.length).toBe(0);

    });

    it("GetById Test with thrown error", async () => {
      mockRepo.SetReturnState(MockRepoErrorState.ThrowError, undefined);
      expect.assertions(5);
      await componentsController.GetById(req, res, next);
      expect(next.mock.calls.length).toBe(1);
      expect(next.mock.calls[0][0].status).toBe(500);
      expect(next.mock.calls[0][0].message).toBe("Thrown error");
      expect(res.status.mock.calls.length).toBe(0);
      expect(res.json.mock.calls.length).toBe(0);
    });
  });

});
