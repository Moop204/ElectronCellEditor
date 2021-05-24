import { Level } from '../../../../types/ILibcellml';

interface IIssue {
  desc: string;
  cause: string;
  type: Level;
}

interface IIssueTextProp {
  issues: IIssue[];
}

export { IIssue, IIssueTextProp };
