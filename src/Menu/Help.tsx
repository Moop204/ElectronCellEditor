import { shell } from 'electron';

const AboutEditor = () => {
  return {
    label: 'About Editor',
    click() {
      shell.openExternal('https://github.com/Moop204/ElectronCellEditor');
    },
  };
};

const AboutCellML = () => {
  return {
    label: 'About CellML',
    click() {
      shell.openExternal('https://www.cellml.org/');
    },
  };
};

const Documentation = () => {
  return {
    label: 'Documentation',
    click() {
      shell.openExternal(
        'https://www.cellml.org/specifications/cellml_2.0/cellml_2_0_normative_specification.pdf'
      );
    },
  };
};

const HelpMenuBar = {
  label: 'Help',
  submenu: [AboutCellML(), Documentation(), AboutEditor()],
};

export { HelpMenuBar };
