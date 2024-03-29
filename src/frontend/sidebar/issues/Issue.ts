import { Level } from "../../../types/ILibcellml";

interface IssueDescriptor {
  desc: string;
  cause: string;
  type: Level;
  url: string;
}

interface IssueList {
  issues: IssueDescriptor[];
}

export { IssueDescriptor, IssueList };
