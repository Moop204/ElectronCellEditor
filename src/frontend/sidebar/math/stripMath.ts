const stripMath = (mathml: string) => {
  mathml = mathml.replace(
    /\< ?math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML" ?\>/g,
    ""
  );
  mathml = mathml.replace(/\<\/ ?math ?\>/g, "");
  return mathml;
};

export { stripMath };
