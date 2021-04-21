import { XmlEditor } from 'react-xml-editor';
import Builder from 'react-xml-editor/lib/Builder';
import React, { useState } from 'react';
import { docSpec } from './Specification';
//import { DocSpec as docSpec } from 'react-xml-editor/lib/types';
import './css/xonomy.css';

export default class EditorXml extends React.Component<
  { xmlInput: string },
  { xml: string }
> {
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

  public render(): React.ReactNode {
    return (
      <>
        <div>
          <XmlEditor
            docSpec={docSpec}
            ref={this.ref}
            xml={this.state.xml}
            mode="laic"
          />
          {/* <button onClick={this.onClickHarvest}>Harvest</button>
        </div>
        <div>
          <pre>{this.state.xml}</pre> */}
        </div>
      </>
    );
  }
}
