import { XmlEditor } from 'react-xml-editor';
import Builder from 'react-xml-editor/lib/Builder';
import { docSpec } from './Specification';
import React, { useState } from 'react';

/*
const xmlInput: string = `<?xml version="1.0" encoding="UTF-8"?> 
<model xmlns="http://www.cellml.org/cellml/2.0#" 
  xmlns:cellml="http://www.cellml.org/cellml/2.0#"  
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  name="complex_encapsulation_example" 
  id="complex_encpsulation_example_id"> 
  <component name="root"/>
  <component name="L1_c1"/>
  <component name="L1_c2"/>
  <component name="L1_c3"/>
  <component name="L1_L2_c1"/>
  <component name="L1_c1"/>
  <component name="L1_c2"/>
  <component name="L1_c2"/>
  <component name="L1_c3"/>
  <component name="L1_L2_c1"/>
  <component name="L1_c1"/>
  <component name="L1_c2"/>
  <component name="L1_c3"/>
  <encapsulation>
    <component_ref component="root">
      <component_ref component="L1_c1">
        <component_ref component="L1_L2_c1"/>
      </component_ref>
      <component_ref component="L1_c2"/>
      <component_ref component="L1_c3"/>
    </component_ref>
  </encapsulation>
  <encapsulation>
    <component_ref component="root">
      <component_ref component="L1_c1">
        <component_ref component="L1_L2_c1"/>
      </component_ref>
      <component_ref component="L1_c2"/>
      <component_ref component="L1_c3"/>
    </component_ref>
  </encapsulation>
</model>`;
*/

/*
class EditorXmlOG extends React.Component<{}, { xml: string }> {
  private ref: React.RefObject<XmlEditor>;

  public constructor(props) {
    const { xmlInput } = props;
    super(props);
    this.ref = React.createRef();
    this.onClickHarvest = this.onClickHarvest.bind(this);
    this.state = {
      xml: xmlInput,
    };
  }

  public render(): React.ReactNode {
    return (
      <>
        <div>
          <XmlEditor docSpec={docSpec} ref={this.ref} xml={this.state.xml} />
          <button onClick={this.onClickHarvest}>Harvest</button>
        </div>
        <div>
          <pre>{this.state.xml}</pre>
        </div>
      </>
    );
  }

  private onClickHarvest(): void {
    if (this.ref.current) {
      const builder = new Builder({});
      const xml = this.ref.current.getXml();
      if (xml) {
        this.setState({
          xml: builder.buildObject(xml),
        });
      }
    }
  }
}
*/

interface EditorProp {
  xmlInput: string;
}

const EditorXml = (props: EditorProp) => {
  const { xmlInput } = props;
  const ref: React.RefObject<XmlEditor> = React.createRef();
  const [xml, setXml] = useState(xmlInput);

  const onClickHarvest = () => {
    if (ref.current) {
      const builder = new Builder({});
      const refXml = ref.current.getXml();
      if (refXml) {
        setXml(builder.buildObject(refXml));
      }
    }
  };

  return (
    <>
      <div>
        <XmlEditor docSpec={docSpec} ref={ref} xml={xml} />
        <button onClick={onClickHarvest}>Harvest</button>
      </div>
      <div>
        <pre>{xml}</pre>
      </div>
    </>
  );
};

export { EditorXml };
