import { DocSpec } from 'react-xml-editor/lib/types';
import * as Util from 'react-xml-editor/lib/Util';

// Give unique names to components automatically
const modelAddNewComponent: any = {
  action: Util.newElementChild('<component name="name">'),
  caption: 'Add a child componentXA@#@!#!',
};

const docSpec: DocSpec = {
  elements: {
    model: {
      attributes: {
        name: {
          asker: Util.askString,
        },
      },
      menu: [
        modelAddNewComponent,
        {
          action: Util.newElementChild('<component name="name">'),
          caption: 'Add a child component',
        },
      ],
    },
    component: {
      attributes: {
        label: {
          asker: Util.askString,
          menu: [
            {
              action: Util.deleteAttribute,
              caption: 'Delete attribute',
            },
          ],
        },
        type: {
          asker: Util.askPicklist([
            {
              value: 'short',
              caption: 'short',
            },
            {
              value: 'medium',
              caption: 'medium',
            },
            'long',
          ]),
        },
      },
      menu: [
        {
          action: Util.newElementChild('<child />'),
          caption: 'Append child <child />',
        },
        {
          action: Util.newAttribute({
            name: 'label',
            value: 'default value',
          }),
          caption: 'Add attribute @label',
          hideIf: (xml, id) => {
            const element = Util.getXmlNode(xml, id);
            return (
              element && element.$ && typeof element.$.label !== 'undefined'
            );
          },
        },
        {
          action: Util.deleteElement,
          caption: 'Delete this <item />',
        },
        {
          action: Util.newElementBefore('<item />'),
          caption: 'New <item /> before this',
        },
        {
          action: Util.newElementAfter('<item />'),
          caption: 'New <item /> after this',
        },
        {
          action: Util.duplicateElement,
          caption: 'Copy <item />',
        },
        {
          action: Util.moveElementUp,
          caption: 'Move <item /> up',
          hideIf: (xml, id) => !Util.canMoveElementUp(xml, id),
        },
        {
          action: Util.moveElementDown,
          caption: 'Move <item /> down',
          hideIf: (xml, id) => !Util.canMoveElementDown(xml, id),
        },
      ],
    },
  },
};

// const docSpec: DocSpec = {
//   elements: {
//     item: {
//       attributes: {
//         label: {
//           asker: Util.askString,
//           menu: [
//             {
//               action: Util.deleteAttribute,
//               caption: 'Delete attribute',
//             },
//           ],
//         },
//         type: {
//           asker: Util.askPicklist([
//             {
//               value: 'short',
//               caption: 'short',
//             },
//             {
//               value: 'medium',
//               caption: 'medium',
//             },
//             'long',
//           ]),
//         },
//       },
//       menu: [
//         {
//           action: Util.newElementChild('<child />'),
//           caption: 'Append child <child />',
//         },
//         {
//           action: Util.newAttribute({
//             name: 'label',
//             value: 'default value',
//           }),
//           caption: 'Add attribute @label',
//           hideIf: (xml, id) => {
//             const element = Util.getXmlNode(xml, id);
//             return (
//               element && element.$ && typeof element.$.label !== 'undefined'
//             );
//           },
//         },
//         {
//           action: Util.deleteElement,
//           caption: 'Delete this <item />',
//         },
//         {
//           action: Util.newElementBefore('<item />'),
//           caption: 'New <item /> before this',
//         },
//         {
//           action: Util.newElementAfter('<item />'),
//           caption: 'New <item /> after this',
//         },
//         {
//           action: Util.duplicateElement,
//           caption: 'Copy <item />',
//         },
//         {
//           action: Util.moveElementUp,
//           caption: 'Move <item /> up',
//           hideIf: (xml, id) => !Util.canMoveElementUp(xml, id),
//         },
//         {
//           action: Util.moveElementDown,
//           caption: 'Move <item /> down',
//           hideIf: (xml, id) => !Util.canMoveElementDown(xml, id),
//         },
//       ],
//     },
//   },
// };

export { docSpec };
