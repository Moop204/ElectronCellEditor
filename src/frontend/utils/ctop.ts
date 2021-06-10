const ctop = `<xsl:stylesheet
version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:mml="http://www.w3.org/1998/Math/MathML"
>

<!--
$Id: ctop.xsl,v 1.3 2002/09/20 08:41:39 davidc Exp $

Copyright David Carlisle 2001, 2002.

Use and distribution of this code are permitted under the terms of the <a
href="http://www.w3.org/Consortium/Legal/copyright-software-19980720"
>W3C Software Notice and License</a>.
-->

<xsl:output method="xml" />

<xsl:template match="*">
<xsl:copy>
<xsl:copy-of select="@*"/>
<xsl:apply-templates />
</xsl:copy>
</xsl:template>


<!-- 4.4.1.1 cn -->
<xsl:template  match="cn">
<xsl:element name="mn"><xsl:apply-templates /></xsl:element>
</xsl:template>

<xsl:template  match="cn[@type='complex-cartesian']">
<xsl:element name="mrow">
  <xsl:element name="mn">
    <xsl:apply-templates  select="text()[1]"/>
  </xsl:element>
  <xsl:element name="mo">
  +
  </xsl:element>
  <xsl:element name="mn"> 
  <xsl:apply-templates  select="text()[2]"/>
  </xsl:element>
  <xsl:element name="mo">
  <!--&#8290;--><!--invisible times-->
  </xsl:element>
  <xsl:element name="mi">
  i<!-- imaginary i -->
  </xsl:element >
</xsl:element>  
</xsl:template>

<xsl:template  match="cn[@type='rational']">
<xsl:element name="mrow">
  <xsl:element name="mn"><xsl:apply-templates  select="text()[1]"/></xsl:element>
  <xsl:element name="mo">/</xsl:element>
  <xsl:element name="mn"><xsl:apply-templates  select="text()[2]"/></xsl:element>
</xsl:element>
</xsl:template>

<xsl:template  match="cn[@type='integer']">
<xsl:choose>
<xsl:when test="not(@base) or @base=10">
     <xsl:element name="mn"><xsl:apply-templates /></xsl:element>
</xsl:when>
<xsl:otherwise>
<xsl:element name="msub">
  <xsl:element name="mn"><xsl:apply-templates /></xsl:element>
  <xsl:element name="mn"><xsl:value-of select="@base"/></xsl:element>
</xsl:element>
</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template  match="cn[@type='complex-polar']">
<xsl:element name="mrow">
  <xsl:element name="mn"><xsl:apply-templates  select="text()[1]"/></xsl:element>
  <xsl:element name="mo"><!--&#8290;--><!--invisible times--></xsl:element>
  <xsl:element name="msup">
  <xsl:element name="mi">e<!-- exponential e--></xsl:element >
  <xsl:element name="mrow">
   <xsl:element name="mi">i<!-- imaginary i--></xsl:element >
   <xsl:element name="mo"><!--&#8290;--><!--invisible times--></xsl:element>
   <xsl:element name="mn"><xsl:apply-templates  select="text()[2]"/></xsl:element>
  </xsl:element >
  </xsl:element>
</xsl:element >
</xsl:template>

<xsl:template  match="cn[@type='e-notation']">
  <xsl:element name="mn"><xsl:apply-templates  select="text()[1]"/>E<xsl:apply-templates  select="text()[2]"/></xsl:element>
</xsl:template>

<!-- 4.4.1.1 ci  -->

<xsl:template  match="ci/text()">
<xsl:element name="mi"><xsl:value-of select="."/></xsl:element >
</xsl:template>

<xsl:template  match="ci">
<xsl:element name="mrow"><xsl:apply-templates /></xsl:element >
</xsl:template>

<!-- 4.4.1.2 csymbol -->

<xsl:template  match="csymbol/text()">
<xsl:element name="mo"><xsl:apply-templates /></xsl:element>
</xsl:template>

<xsl:template  match="csymbol">
<xsl:element name="mrow"><xsl:apply-templates /></xsl:element >
</xsl:template>

<!-- 4.4.2.1 apply 4.4.2.2 reln -->

<xsl:template  match="apply|reln">
  <xsl:element name="mrow">
    <xsl:apply-templates  select="*[1]">
      <xsl:with-param name="p" select="10"/>
    </xsl:apply-templates>
    <xsl:element name="mo">
      <!--&#8290;--><!--invisible times-->
    </xsl:element>
    <xsl:element name="mfenced">
      <xsl:attribute name="open">
        (
      </xsl:attribute>
      <xsl:attribute name="close">
        )
      </xsl:attribute>
      <xsl:attribute name="separators">
        ,
      </xsl:attribute>
      <xsl:apply-templates  select="*[position()>1]"/>
    </xsl:element>
  </xsl:element>
</xsl:template>

<!-- 4.4.2.3 fn -->
<xsl:template  match="fn">
<xsl:element name="mrow"><xsl:apply-templates /></xsl:element >
</xsl:template>

<!-- 4.4.2.4 interval -->
<xsl:template  match="interval[*[2]]">
<xsl:element name="mfenced">
  <xsl:attribute name="open">
    [
  </xsl:attribute>
  <xsl:attribute name="close">
    ]
  </xsl:attribute>
  <xsl:apply-templates />
</xsl:element >
</xsl:template>
<xsl:template  match="interval[*[2]][@closure='open']">
<xsl:element name="mfenced">
  <xsl:attribute name="open">
    (
  </xsl:attribute>
  <xsl:attribute name="close">
    )
  </xsl:attribute>
  <xsl:apply-templates />
</xsl:element >
</xsl:template>
<xsl:template  match="interval[*[2]][@closure='open-closed']">
<xsl:element name="mfenced">
  <xsl:attribute name="open">
    (
  </xsl:attribute>
  <xsl:attribute name="close">
    ]
  </xsl:attribute>
  <xsl:apply-templates />
</xsl:element >
</xsl:template>
<xsl:template  match="interval[*[2]][@closure='closed-open']">
<xsl:element name="mfenced">
  <xsl:attribute name="open">
    [
  </xsl:attribute>
  <xsl:attribute name="close">
    )
  </xsl:attribute>
  <xsl:apply-templates />
</xsl:element >
</xsl:template>

<xsl:template  match="interval">
<xsl:element name="mfenced">
  <xsl:attribute name="open">
    {{
  </xsl:attribute>
  <xsl:attribute name="close">
    }}
  </xsl:attribute>
  <xsl:apply-templates />
</xsl:element >
</xsl:template>

<!-- 4.4.2.5 inverse -->

<xsl:template  match="apply[*[1][self::inverse]]">
<xsl:element name="msup">
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mrow"><xsl:element name="mo">(</xsl:element><xsl:element name="mn">-1</xsl:element><xsl:element name="mo">)</xsl:element></xsl:element >
</xsl:element>
</xsl:template>

<!-- 4.4.2.6 sep -->

<!-- 4.4.2.7 condition -->
<xsl:template  match="condition">
<xsl:element name="mrow"><xsl:apply-templates /></xsl:element >
</xsl:template>

<!-- 4.4.2.8 declare -->
<xsl:template  match="declare"/>

<!-- 4.4.2.9 lambda -->
<xsl:template  match="apply[*[1][self::lambda]]">
<xsl:element name="mrow">
<xsl:element name="mi">&#955;<!--lambda--></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="bvar/*"/></xsl:element >
<xsl:element name="mo">.</xsl:element>
<xsl:element name="mfenced">
<xsl:apply-templates  select="*[last()]"/>
</xsl:element >
</xsl:element >
</xsl:template>


<!-- 4.4.2.10 compose -->
<xsl:template  match="apply[*[1][self::compose]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8728;<!-- o --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>


<!-- 4.4.2.11 ident -->
<xsl:template  match="ident">
<xsl:element name="mo">id</xsl:element>
</xsl:template>

<!-- 4.4.2.12 domain -->
<xsl:template  match="domain">
<xsl:element name="mo">domain</xsl:element>
</xsl:template>

<!-- 4.4.2.13 codomain -->
<xsl:template  match="codomain">
<xsl:element name="mo">codomain</xsl:element>
</xsl:template>

<!-- 4.4.2.14 image -->
<xsl:template  match="image">
<xsl:element name="mo">image</xsl:element>
</xsl:template>

<!-- 4.4.2.15 domainofapplication -->
<xsl:template  match="domainofapplication">
<error/>
</xsl:template>

<!-- 4.4.2.16 piecewise -->
<xsl:template  match="piecewise">
<xsl:element name="mrow">
<xsl:element name="mo">{</xsl:element>
<xsl:element name="mtable" >
<xsl:for-each select="piece|otherwise">
<xsl:element name="mtr" >
<xsl:element name="mtd"><xsl:apply-templates  select="*[1]"/></xsl:element >
<xsl:element name="mtd"><xsl:element name="mtext">&#160; if &#160;</xsl:element></xsl:element >
<xsl:element name="mtd"><xsl:apply-templates  select="*[2]"/></xsl:element >
</xsl:element >
</xsl:for-each>
</xsl:element >
</xsl:element >
</xsl:template>


<!-- 4.4.3.1 quotient -->
<xsl:template  match="apply[*[1][self::quotient]]">
<xsl:element name="mrow">
<xsl:element name="mo">&#8970;<!-- lfloor--></xsl:element>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">/</xsl:element>
<xsl:apply-templates  select="*[3]"/>
<xsl:element name="mo">&#8971;<!-- rfloor--></xsl:element>
</xsl:element >
</xsl:template>



<!-- 4.4.3.2 factorial -->
<xsl:template  match="apply[*[1][self::factorial]]">
<xsl:element name="mrow">
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
<xsl:element name="mo">!</xsl:element>
</xsl:element >
</xsl:template>


<!-- 4.4.3.3 divide -->
<xsl:template  match="apply[*[1][self::divide]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">/</xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="3"/>
</xsl:call-template>
</xsl:template>


<!-- 4.4.3.4 max  min-->
<xsl:template  match="apply[*[1][self::max]]">
<xsl:element name="mrow">
<xsl:element name="mo">max</xsl:element>
<xsl:call-template name="set"/>
</xsl:element >
</xsl:template>

<xsl:template  match="apply[*[1][self::min]]">
<xsl:element name="mrow">
<xsl:element name="mo">max</xsl:element>
<xsl:call-template name="set"/>
</xsl:element >
</xsl:template>

<!-- 4.4.3.5  minus-->
<xsl:template  match="apply[*[1][self::minus] and count(*)=2]">
<xsl:element name="mrow">
<xsl:element name="mo">&#8722;<!--minus--></xsl:element>
<xsl:apply-templates  select="*[2]">
    <xsl:with-param name="p" select="5"/>
</xsl:apply-templates>
</xsl:element >
</xsl:template>

<xsl:template  match="apply[*[1][self::minus] and count(*)&gt;2]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">&#8722;<!--minus--></xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="2"/>
</xsl:call-template>
</xsl:template>

<!-- 4.4.3.6  plus-->
<xsl:template  match="apply[*[1][self::plus]]">
<xsl:param name="p" select="0"/>
<xsl:element name="mrow">
<xsl:if test="$p &gt; 2"><xsl:element name="mo">(</xsl:element></xsl:if>
<xsl:for-each select="*[position()&gt;1]">
 <xsl:if test="position() &gt; 1">
  <xsl:element name="mo">
  <xsl:choose>
    <xsl:when test="self::apply[*[1][self::times] and
    *[2][self::apply/*[1][self::minus] or self::cn[not(sep) and
    (number(.) &lt; 0)]]]">&#8722;<!--minus--></xsl:when>
    <xsl:otherwise>+</xsl:otherwise>
  </xsl:choose>
  </xsl:element>
 </xsl:if>   
  <xsl:choose>
    <xsl:when test="self::apply[*[1][self::times] and
    *[2][self::cn[not(sep) and (number(.) &lt;0)]]]">
   <xsl:element name="mrow">
   <xsl:element name="mn"><xsl:value-of select="-(*[2])"/></xsl:element>
    <xsl:element name="mo"><!--&#8290;--><!--invisible times--></xsl:element>
   <xsl:apply-templates  select=".">
   <xsl:with-param name="first" select="2"/>
   <xsl:with-param name="p" select="2"/>
 </xsl:apply-templates>
   </xsl:element >
    </xsl:when>
    <xsl:when test="self::apply[*[1][self::times] and
    *[2][self::apply/*[1][self::minus]]]">
   <xsl:element name="mrow">
   <xsl:apply-templates  select="./*[2]/*[2]"/>
   <xsl:apply-templates  select=".">
   <xsl:with-param name="first" select="2"/>
   <xsl:with-param name="p" select="2"/>
 </xsl:apply-templates>
   </xsl:element >
    </xsl:when>
    <xsl:otherwise>
   <xsl:apply-templates  select=".">
   <xsl:with-param name="p" select="2"/>
 </xsl:apply-templates>
 </xsl:otherwise>
  </xsl:choose>
</xsl:for-each>
<xsl:if test="$p &gt; 2"><xsl:element name="mo">)</xsl:element></xsl:if>
</xsl:element >
</xsl:template>


<!-- 4.4.3.7 power -->
<xsl:template  match="apply[*[1][self::power]]">
<xsl:element name="msup">
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="5"/>
</xsl:apply-templates>
<xsl:apply-templates  select="*[3]">
<xsl:with-param name="p" select="5"/>
</xsl:apply-templates>
</xsl:element>
</xsl:template>

<!-- 4.4.3.8 remainder -->
<xsl:template  match="apply[*[1][self::rem]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">mod</xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="3"/>
</xsl:call-template>
</xsl:template>

<!-- 4.4.3.9  times-->
<xsl:template  match="apply[*[1][self::times]]" name="times">
<xsl:param name="p" select="0"/>
<xsl:param name="first" select="1"/>
<xsl:element name="mrow">
<xsl:if test="$p &gt; 3"><xsl:element name="mo">(</xsl:element></xsl:if>
<xsl:for-each select="*[position()&gt;1]">
 <xsl:if test="position() &gt; 1">
  <xsl:element name="mo">
  <xsl:choose>
    <xsl:when test="self::cn">&#215;<!-- times --></xsl:when>
    <xsl:otherwise><!--&#8290;--><!--invisible times--></xsl:otherwise>
  </xsl:choose>
  </xsl:element>
 </xsl:if> 
 <xsl:if test="position()&gt;= $first">
 <xsl:apply-templates  select=".">
   <xsl:with-param name="p" select="3"/>
 </xsl:apply-templates>
 </xsl:if>
</xsl:for-each>
<xsl:if test="$p &gt; 3"><xsl:element name="mo">)</xsl:element></xsl:if>
</xsl:element >
</xsl:template>


<!-- 4.4.3.10 root -->
<xsl:template  match="apply[*[1][self::root] and not(degree) or degree=2]" priority="4">
<xsl:element name="msqrt">
<xsl:apply-templates  select="*[position()&gt;1]"/>
</xsl:element>
</xsl:template>

<xsl:template  match="apply[*[1][self::root]]">
<xsl:element name="mroot">
<xsl:apply-templates  select="*[position()&gt;1 and not(self::degree)]"/>
<xsl:element name="mrow"><xsl:apply-templates  select="degree/*"/></xsl:element >
</xsl:element>
</xsl:template>

<!-- 4.4.3.11 gcd -->
<xsl:template  match="gcd">
<xsl:element name="mo">gcd</xsl:element>
</xsl:template>

<!-- 4.4.3.12 and -->
<xsl:template  match="apply[*[1][self::and]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8743;<!-- and --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>


<!-- 4.4.3.13 or -->
<xsl:template  match="apply[*[1][self::or]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="3"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8744;<!-- or --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.3.14 xor -->
<xsl:template  match="apply[*[1][self::xor]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="3"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">xor</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>


<!-- 4.4.3.15 not -->
<xsl:template  match="apply[*[1][self::not]]">
<xsl:element name="mrow">
<xsl:element name="mo">&#172;<!-- not --></xsl:element>
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
</xsl:element >
</xsl:template>




<!-- 4.4.3.16 implies -->
<xsl:template  match="apply[*[1][self::implies]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">&#8658;<!-- Rightarrow --></xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="3"/>
</xsl:call-template>
</xsl:template>


<!-- 4.4.3.17 forall -->
<xsl:template  match="apply[*[1][self::forall]]">
<xsl:element name="mrow">
<xsl:element name="mi">&#8704;<!--forall--></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="bvar[not(current()/condition)]/*|condition/*"/></xsl:element >
<xsl:element name="mo">.</xsl:element>
<xsl:element name="mfenced">
<xsl:apply-templates  select="*[last()]"/>
</xsl:element >
</xsl:element >
</xsl:template>



<!-- 4.4.3.18 exists -->
<xsl:template  match="apply[*[1][self::exists]]">
<xsl:element name="mrow">
<xsl:element name="mi">&#8707;<!--exists--></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="bvar[not(current()/condition)]/*|condition/*"/></xsl:element >
<xsl:element name="mo">.</xsl:element>
<xsl:element name="mfenced">
<xsl:apply-templates  select="*[last()]"/>
</xsl:element >
</xsl:element >
</xsl:template>


<!-- 4.4.3.19 abs -->
<xsl:template  match="apply[*[1][self::abs]]">
<xsl:element name="mrow">
<xsl:element name="mo">|</xsl:element>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">|</xsl:element>
</xsl:element >
</xsl:template>



<!-- 4.4.3.20 conjugate -->
<xsl:template  match="apply[*[1][self::conjugate]]">
<mover>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">&#175;<!-- overline --></xsl:element>
</mover>
</xsl:template>

<!-- 4.4.3.21 arg -->
<xsl:template  match="arg">
<xsl:element name="mo">arg</xsl:element>
</xsl:template>


<!-- 4.4.3.22 real -->
<xsl:template  match="real">
<xsl:element name="mo">&#8475;<!-- real --></xsl:element>
</xsl:template>

<!-- 4.4.3.23 imaginary -->
<xsl:template  match="imaginary">
<xsl:element name="mo">&#8465;<!-- imaginary --></xsl:element>
</xsl:template>

<!-- 4.4.3.24 lcm -->
<xsl:template  match="lcm">
<xsl:element name="mo">lcm</xsl:element>
</xsl:template>


<!-- 4.4.3.25 floor -->
<xsl:template  match="apply[*[1][self::floor]]">
<xsl:element name="mrow">
<xsl:element name="mo">&#8970;<!-- lfloor--></xsl:element>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">&#8971;<!-- rfloor--></xsl:element>
</xsl:element >
</xsl:template>


<!-- 4.4.3.25 ceiling -->
<xsl:template  match="apply[*[1][self::ceiling]]">
<xsl:element name="mrow">
<xsl:element name="mo">&#8968;<!-- lceil--></xsl:element>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">&#8969;<!-- rceil--></xsl:element>
</xsl:element >
</xsl:template>

<!-- 4.4.4.1 eq -->
<xsl:template  match="apply[*[1][self::eq]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">=</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.2 neq -->
<xsl:template  match="apply[*[1][self::neq]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8800;<!-- neq --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.3 eq -->
<xsl:template  match="apply[*[1][self::gt]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&gt;</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.4 lt -->
<xsl:template  match="apply[*[1][self::lt]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&lt;</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.5 geq -->
<xsl:template  match="apply[*[1][self::geq]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8805;</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.6 geq -->
<xsl:template  match="apply[*[1][self::leq]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8804;</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.7 equivalent -->
<xsl:template  match="apply[*[1][self::equivalent]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8801;</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.4.8 approx -->
<xsl:template  match="apply[*[1][self::approx]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="1"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8771;</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>


<!-- 4.4.4.9 factorof -->
<xsl:template  match="apply[*[1][self::factorof]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">|</xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="3"/>
</xsl:call-template>
</xsl:template>

<!-- 4.4.5.1 int -->
<xsl:template  match="apply[*[1][self::int]]">
<xsl:element name="mrow">
<msubsup>
<xsl:element name="mi">&#8747;<!--int--></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="lowlimit/*|interval/*[1]|condition/*"/></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="uplimit/*|interval/*[2]"/></xsl:element >
</msubsup>
<xsl:apply-templates  select="*[last()]"/>
<xsl:element name="mo">d</xsl:element><xsl:apply-templates  select="bvar"/>
</xsl:element >
</xsl:template>

<!-- 4.4.5.2 diff -->
<xsl:template  match="apply[*[1][self::diff] and ci and count(*)=2]" priority="2">
<xsl:element name="msup">
<xsl:element name="mrow"><xsl:apply-templates  select="*[2]"/></xsl:element >
<xsl:element name="mo">&#8242;<!--prime--></xsl:element>
</xsl:element>
</xsl:template>

<xsl:template  match="apply[*[1][self::diff]]" priority="1">
<mfrac>
<xsl:choose>
<xsl:when test="bvar/degree">
<xsl:element name="mrow"><xsl:element name="msup"><xsl:element name="mo">d</xsl:element><xsl:apply-templates  select="bvar/degree/node()"/></xsl:element>
   <xsl:apply-templates   select="*[last()]"/></xsl:element >
<xsl:element name="mrow"><xsl:element name="mo">d</xsl:element><xsl:element name="msup"><xsl:apply-templates 
select="bvar/node()"/><xsl:apply-templates 
select="bvar/degree/node()"/></xsl:element>
</xsl:element >
</xsl:when>
<xsl:otherwise>
<xsl:element name="mrow"><xsl:element name="mo">d</xsl:element><xsl:apply-templates  select="*[last()]"/></xsl:element >
<xsl:element name="mrow"><xsl:element name="mo">d</xsl:element><xsl:apply-templates  select="bvar"/></xsl:element >
</xsl:otherwise>
</xsl:choose>
</mfrac>
</xsl:template>


<!-- 4.4.5.3 partialdiff -->
<xsl:template  match="apply[*[1][self::partialdiff] and list and ci and count(*)=3]" priority="2">
<xsl:element name="mrow">
<xsl:element name="msub"><xsl:element name="mo">D</xsl:element><xsl:element name="mrow">
<xsl:for-each select="list[1]/*">
<xsl:apply-templates  select="."/>
<xsl:if test="position()&lt;last()"><xsl:element name="mo">,</xsl:element></xsl:if>
</xsl:for-each>
</xsl:element ></xsl:element>
<xsl:element name="mrow"><xsl:apply-templates  select="*[3]"/></xsl:element >
</xsl:element >
</xsl:template>

<xsl:template  match="apply[*[1][self::partialdiff]]" priority="1">
<mfrac>
<xsl:element name="mrow"><xsl:element name="msup"><xsl:element name="mo">&#8706;<!-- partial --></xsl:element>
<xsl:element name="mrow">
<xsl:choose>
<xsl:when test="degree">
<xsl:apply-templates  select="degree/node()"/>
</xsl:when>
<xsl:when test="bvar/degree[string(number(.))='NaN']">
<xsl:for-each select="bvar/degree">
<xsl:apply-templates  select="node()"/>
<xsl:if test="position()&lt;last()"><xsl:element name="mo">+</xsl:element></xsl:if>
</xsl:for-each>
<xsl:if test="count(bvar[not(degree)])&gt;0">
<xsl:element name="mo">+</xsl:element><xsl:element name="mn"><xsl:value-of select="count(bvar[not(degree)])"/></xsl:element>
</xsl:if>
</xsl:when>
<xsl:otherwise>
<xsl:element name="mn"><xsl:value-of select="sum(bvar/degree)+count(bvar[not(degree)])"/></xsl:element>
</xsl:otherwise>
</xsl:choose>
</xsl:element >
</xsl:element>
   <xsl:apply-templates   select="*[last()]"/></xsl:element >
<xsl:element name="mrow">
<xsl:for-each select="bvar">
<xsl:element name="mrow">
<xsl:element name="mo">&#8706;<!-- partial --></xsl:element><xsl:element name="msup"><xsl:apply-templates  select="node()"/>
                   <xsl:element name="mrow"><xsl:apply-templates  select="degree/node()"/></xsl:element >
</xsl:element>
</xsl:element >
</xsl:for-each>
</xsl:element >
</mfrac>
</xsl:template>

<!-- 4.4.5.4  lowlimit-->
<xsl:template  match="lowlimit"/>

<!-- 4.4.5.5 uplimit-->
<xsl:template  match="uplimit"/>

<!-- 4.4.5.6  bvar-->
<xsl:template  match="bvar">
<xsl:element name="mi"><xsl:apply-templates /></xsl:element >
<xsl:if test="following-sibling::bvar"><xsl:element name="mo">,</xsl:element></xsl:if>
</xsl:template>

<!-- 4.4.5.7 degree-->
<xsl:template  match="degree"/>

<!-- 4.4.5.8 divergence-->
<xsl:template  match="divergence">
<xsl:element name="mo">div</xsl:element>
</xsl:template>

<!-- 4.4.5.9 grad-->
<xsl:template  match="grad">
<xsl:element name="mo">grad</xsl:element>
</xsl:template>

<!-- 4.4.5.10 curl -->
<xsl:template  match="curl">
<xsl:element name="mo">curl</xsl:element>
</xsl:template>


<!-- 4.4.5.11 laplacian-->
<xsl:template  match="laplacian">
<xsl:element name="msup"><xsl:element name="mo">&#8711;<!-- nabla --></xsl:element><xsl:element name="mn">2</xsl:element></xsl:element>
</xsl:template>

<!-- 4.4.6.1 set -->

<xsl:template  match="set">
<xsl:call-template name="set"/>
</xsl:template>

<!-- 4.4.6.2 list -->

<xsl:template  match="list">
<xsl:call-template name="set">
 <xsl:with-param name="o" select="'('"/>
 <xsl:with-param name="c" select="')'"/>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.3 union -->
<xsl:template  match="apply[*[1][self::union]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8746;<!-- union --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.4 intersect -->
<xsl:template  match="apply[*[1][self::intersect]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="3"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8745;<!-- intersect --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.5 in -->
<xsl:template  match="apply[*[1][self::in]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">&#8712;<!-- in --></xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="3"/>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.5 notin -->
<xsl:template  match="apply[*[1][self::notin]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="mo"><xsl:element name="mo">&#8713;<!-- not in --></xsl:element></xsl:with-param>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="this-p" select="3"/>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.7 subset -->
<xsl:template  match="apply[*[1][self::subset]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8838;<!-- subseteq --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.8 prsubset -->
<xsl:template  match="apply[*[1][self::prsubset]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8834;<!-- prsubset --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.9 notsubset -->
<xsl:template  match="apply[*[1][self::notsubset]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8840;<!-- notsubseteq --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.10 notprsubset -->
<xsl:template  match="apply[*[1][self::notprsubset]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8836;<!-- prsubset --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.11 setdiff -->
<xsl:template  match="apply[*[1][self::setdiff]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="binary">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#8726;<!-- setminus --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.6.12 card -->
<xsl:template  match="apply[*[1][self::card]]">
<xsl:element name="mrow">
<xsl:element name="mo">|</xsl:element>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">|</xsl:element>
</xsl:element >
</xsl:template>

<!-- 4.4.6.13 cartesianproduct -->
<xsl:template  match="apply[*[1][self::cartesianproduct or self::vectorproduct]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">&#215;<!-- times --></xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<xsl:template
match="apply[*[1][self::cartesianproduct][count(following-sibling::reals)=count(following-sibling::*)]]"
priority="2">
<xsl:element name="msup">
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="5"/>
</xsl:apply-templates>
<xsl:element name="mn"><xsl:value-of select="count(*)-1"/></xsl:element>
</xsl:element>
</xsl:template>


<!-- 4.4.7.1 sum -->
<xsl:template  match="apply[*[1][self::sum]]">
<xsl:element name="mrow">
<msubsup>
<xsl:element name="mo">&#8721;<!--sum--></xsl:element>
<xsl:element name="mrow"><xsl:apply-templates  select="lowlimit/*|interval/*[1]|condition/*"/></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="uplimit/*|interval/*[2]"/></xsl:element >
</msubsup>
<xsl:apply-templates  select="*[last()]"/>
</xsl:element >
</xsl:template>

<!-- 4.4.7.2 product -->
<xsl:template  match="apply[*[1][self::product]]">
<xsl:element name="mrow">
<msubsup>
<xsl:element name="mo">&#8719;<!--product--></xsl:element>
<xsl:element name="mrow"><xsl:apply-templates  select="lowlimit/*|interval/*[1]|condition/*"/></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="uplimit/*|interval/*[2]"/></xsl:element >
</msubsup>
<xsl:apply-templates  select="*[last()]"/>
</xsl:element >
</xsl:template>

<!-- 4.4.7.3 limit -->
<xsl:template  match="apply[*[1][self::limit]]">
<xsl:element name="mrow">
<munder>
<xsl:element name="mi">limit</xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="lowlimit|condition/*"/></xsl:element >
</munder>
<xsl:apply-templates  select="*[last()]"/>
</xsl:element >
</xsl:template>

<xsl:template  match="apply[limit]/lowlimit" priority="3">
<xsl:element name="mrow">
<xsl:apply-templates  select="../bvar/node()"/>
<xsl:element name="mo">&#8594;<!--rightarrow--></xsl:element>
<xsl:apply-templates />
</xsl:element >
</xsl:template>


<!-- 4.4.7.4 tendsto -->
<xsl:template  match="apply[*[1][self::tendsto]]">
<xsl:param name="p"/>
<xsl:call-template name="binary">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">
<xsl:choose>
 <xsl:when test="@type='above'">&#8600;<!--searrow--></xsl:when>
 <xsl:when test="@type='below'">&#8599;<!--nearrow--></xsl:when>
 <xsl:when test="@type='two-sided'">&#8594;<!--rightarrow--></xsl:when>
 <xsl:otherwise>&#8594;<!--rightarrow--></xsl:otherwise>
</xsl:choose>
</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.8.1 trig -->
<xsl:template  match="apply[*[1][
self::sin or self::cos or self::tan or self::sec or
self::csc or self::cot or self::sinh or self::cosh or
self::tanh or self::sech or self::csch or self::coth or
self::arcsin or self::arccos or self::arctan or self::arccosh
or self::arccot or self::arccoth or self::arccsc or
self::arccsch or self::arcsec or self::arcsech or
self::arcsinh or self::arctanh or self::ln]]">
<xsl:element name="mrow">
<xsl:element name="mi"><xsl:value-of select="local-name(*[1])"/></xsl:element >
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
</xsl:element >
</xsl:template>




<!-- 4.4.8.2 exp -->
<xsl:template  match="apply[*[1][self::exp]]">
<xsl:element name="msup">
<xsl:element name="mi">e<!-- exponential e--></xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="*[2]"/></xsl:element >
</xsl:element>
</xsl:template>

<!-- 4.4.8.3 ln -->
<!-- with trig -->

<!-- 4.4.8.4 log -->
<xsl:template  match="apply[*[1][self::log]]">
<xsl:element name="mrow">
<xsl:choose>
<xsl:when test="not(logbase) or logbase=10">
<xsl:element name="mi">log</xsl:element >
</xsl:when>
<xsl:otherwise>
<xsl:element name="msub">
<xsl:element name="mi">log</xsl:element >
<xsl:element name="mrow"><xsl:apply-templates  select="logbase/node()"/></xsl:element >
</xsl:element>
</xsl:otherwise>
</xsl:choose>
<xsl:apply-templates  select="*[last()]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
</xsl:element >
</xsl:template>


<!-- 4.4.9.1 mean -->
<xsl:template  match="apply[*[1][self::mean]]">
<xsl:element name="mrow">
<xsl:element name="mo">&#9001;<!--langle--></xsl:element>
  <xsl:for-each select="*[position()&gt;1]">
    <xsl:apply-templates  select="."/>
    <xsl:if test="position() !=last()"><xsl:element name="mo">,</xsl:element></xsl:if>
  </xsl:for-each>
<xsl:element name="mo">&#9002;<!--rangle--></xsl:element>
</xsl:element >
</xsl:template>


<!-- 4.4.9.2 sdef -->
<xsl:template  match="sdev">
<xsl:element name="mo">&#963;<!--sigma--></xsl:element>
</xsl:template>

<!-- 4.4.9.3 variance -->
<xsl:template  match="apply[*[1][self::variance]]">
<xsl:element name="msup">
<xsl:element name="mrow">
<xsl:element name="mo">&#963;<!--sigma--></xsl:element>
<xsl:element name="mo">(</xsl:element>
<xsl:apply-templates  select="*[2]"/>
<xsl:element name="mo">)</xsl:element>
</xsl:element >
<xsl:element name="mn">2</xsl:element>
</xsl:element>
</xsl:template>


<!-- 4.4.9.4 median -->
<xsl:template  match="median">
<xsl:element name="mo">median</xsl:element>
</xsl:template>


<!-- 4.4.9.5 mode -->
<xsl:template  match="mode">
<xsl:element name="mo">mode</xsl:element>
</xsl:template>

<!-- 4.4.9.5 moment -->
<xsl:template  match="apply[*[1][self::moment]]">
<xsl:element name="mrow">
<xsl:element name="mo">&#9001;<!--langle--></xsl:element>
     <xsl:element name="msup">
    <xsl:apply-templates  select="*[last()]"/>
    <xsl:element name="mrow"><xsl:apply-templates  select="degree/node()"/></xsl:element >
     </xsl:element>
<xsl:element name="mo">&#9002;<!--rangle--></xsl:element>
</xsl:element >
</xsl:template>

<!-- 4.4.9.5 momentabout -->
<xsl:template  match="momentabout"/>

<!-- 4.4.10.1 vector  -->
<xsl:template  match="vector">
<xsl:element name="mrow">
<xsl:element name="mo">(</xsl:element>
<xsl:element name="mtable" >
<xsl:for-each select="*">
<xsl:element name="mtr" ><xsl:element name="mtd"><xsl:apply-templates  select="."/></xsl:element ></xsl:element >
</xsl:for-each>
</xsl:element >
<xsl:element name="mo">)</xsl:element>
</xsl:element >
</xsl:template>

<!-- 4.4.10.2 matrix  -->
<xsl:template  match="matrix">
<xsl:element name="mrow">
<xsl:element name="mo">(</xsl:element>
<xsl:element name="mtable" >
<xsl:apply-templates />
</xsl:element >
<xsl:element name="mo">)</xsl:element>
</xsl:element >
</xsl:template>

<!-- 4.4.10.3 matrixrow  -->
<xsl:template  match="matrixrow">
<xsl:element name="mtr" >
<xsl:for-each select="*">
<xsl:element name="mtd"><xsl:apply-templates  select="."/></xsl:element >
</xsl:for-each>
</xsl:element >
</xsl:template>

<!-- 4.4.10.4 determinant  -->
<xsl:template  match="apply[*[1][self::determinant]]">
<xsl:element name="mrow">
<xsl:element name="mi">det</xsl:element >
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
</xsl:element >
</xsl:template>

<xsl:template
match="apply[*[1][self::determinant]][*[2][self::matrix]]" priority="2">
<xsl:element name="mrow">
<xsl:element name="mo">|</xsl:element>
<xsl:element name="mtable" >
<xsl:apply-templates  select="matrix/*"/>
</xsl:element >
<xsl:element name="mo">|</xsl:element>
</xsl:element >
</xsl:template>

<!-- 4.4.10.5 transpose -->
<xsl:template  match="apply[*[1][self::transpose]]">
<xsl:element name="msup">
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
<xsl:element name="mi">T</xsl:element >
</xsl:element>
</xsl:template>

<!-- 4.4.10.5 selector -->
<xsl:template  match="apply[*[1][self::selector]]">
<xsl:element name="msub">
<xsl:apply-templates  select="*[2]">
<xsl:with-param name="p" select="7"/>
</xsl:apply-templates>
<xsl:element name="mrow">
  <xsl:for-each select="*[position()&gt;2]">
    <xsl:apply-templates  select="."/>
    <xsl:if test="position() !=last()"><xsl:element name="mo">,</xsl:element></xsl:if>
  </xsl:for-each>
</xsl:element >
</xsl:element>
</xsl:template>

<!-- *** -->
<!-- 4.4.10.6 vectorproduct see cartesianproduct -->


<!-- 4.4.10.7 scalarproduct-->
<xsl:template  match="apply[*[1][self::scalarproduct or self::outerproduct]]">
<xsl:param name="p" select="0"/>
<xsl:call-template name="infix">
<xsl:with-param name="this-p" select="2"/>
<xsl:with-param name="p" select="$p"/>
<xsl:with-param name="mo"><xsl:element name="mo">.</xsl:element></xsl:with-param>
</xsl:call-template>
</xsl:template>

<!-- 4.4.10.8 outerproduct-->

<!-- 4.4.11.2 semantics -->
<xsl:template  match="semantics">
<xsl:apply-templates  select="*[1]"/>
</xsl:template>
<xsl:template  match="semantics[annotation-xml/@encoding='MathML-Presentation']">
<xsl:apply-templates  select="annotation-xml[@encoding='MathML-Presentation']/node()"/>
</xsl:template>

<!-- 4.4.12.1 integers -->
<xsl:template  match="integers">
<xsl:element name="mi">
  <xsl:attribute name="mathvariant">
    double-struck
  </xsl:attribute>
  Z
</xsl:element >
</xsl:template>

<!-- 4.4.12.2 reals -->
<xsl:template  match="reals">
<xsl:element name="mi">
  <xsl:attribute name="mathvariant">
    double-struck
  </xsl:attribute>
  R
</xsl:element >
</xsl:template>

<!-- 4.4.12.3 rationals -->
<xsl:template  match="rationals">
<xsl:element name="mi">
  <xsl:attribute name="mathvariant">
    double-struck
  </xsl:attribute>
  Q
</xsl:element >
</xsl:template>

<!-- 4.4.12.4 naturalnumbers -->
<xsl:template  match="naturalnumbers">
<xsl:element name="mi">
  <xsl:attribute name="mathvariant">
    double-struck
  </xsl:attribute>
  N
</xsl:element >
</xsl:template>

<!-- 4.4.12.5 complexes -->
<xsl:template  match="complexes">
<xsl:element name="mi">
  <xsl:attribute name="mathvariant">
    double-struck
  </xsl:attribute>
  C
</xsl:element >
</xsl:template>

<!-- 4.4.12.6 primes -->
<xsl:template  match="primes">
<xsl:element name="mi">
  <xsl:attribute name="mathvariant">
    double-struck
  </xsl:attribute>
  P
</xsl:element >
</xsl:template>

<!-- 4.4.12.7 exponentiale -->
<xsl:template  match="exponentiale">
<xsl:element name="mi">e<!-- exponential e--></xsl:element >
</xsl:template>

<!-- 4.4.12.8 imaginaryi -->
<xsl:template  match="imaginaryi">
<xsl:element name="mi">i<!-- imaginary i--></xsl:element >
</xsl:template>

<!-- 4.4.12.9 notanumber -->
<xsl:template  match="notanumber">
<xsl:element name="mi">NaN</xsl:element >
</xsl:template>

<!-- 4.4.12.10 true -->
<xsl:template  match="true">
<xsl:element name="mi">true</xsl:element >
</xsl:template>

<!-- 4.4.12.11 false -->
<xsl:template  match="false">
<xsl:element name="mi">false</xsl:element >
</xsl:template>

<!-- 4.4.12.12 emptyset -->
<xsl:template  match="emptyset">
<xsl:element name="mi">&#8709;<!-- emptyset --></xsl:element >
</xsl:template>


<!-- 4.4.12.13 pi -->
<xsl:template  match="pi">
<xsl:element name="mi">&#960;<!-- pi --></xsl:element >
</xsl:template>

<!-- 4.4.12.14 eulergamma -->
<xsl:template  match="eulergamma">
<xsl:element name="mi">&#947;<!-- gamma --></xsl:element >
</xsl:template>

<!-- 4.4.12.15 infinity -->
<xsl:template  match="infinity">
<xsl:element name="mi">&#8734;<!-- infinity --></xsl:element >
</xsl:template>


<!-- ****************************** -->
<xsl:template name="infix" >
<xsl:param name="mo"/>
<xsl:param name="p" select="0"/>
<xsl:param name="this-p" select="0"/>
<xsl:element name="mrow">
<xsl:if test="$this-p &lt; $p"><xsl:element name="mo">(</xsl:element></xsl:if>
<xsl:for-each select="*[position()&gt;1]">
 <xsl:if test="position() &gt; 1">
  <xsl:copy-of select="$mo"/>
 </xsl:if>   
 <xsl:apply-templates  select=".">
   <xsl:with-param name="p" select="$this-p"/>
 </xsl:apply-templates>
</xsl:for-each>
<xsl:if test="$this-p &lt; $p"><xsl:element name="mo">)</xsl:element></xsl:if>
</xsl:element >
</xsl:template>

<xsl:template name="binary" >
<xsl:param name="mo"/>
<xsl:param name="p" select="0"/>
<xsl:param name="this-p" select="0"/>
<xsl:element name="mrow">
<xsl:if test="$this-p &lt; $p"><xsl:element name="mo">(</xsl:element></xsl:if>
 <xsl:apply-templates  select="*[2]">
   <xsl:with-param name="p" select="$this-p"/>
 </xsl:apply-templates>
 <xsl:copy-of select="$mo"/>
 <xsl:apply-templates  select="*[3]">
   <xsl:with-param name="p" select="$this-p"/>
 </xsl:apply-templates>
<xsl:if test="$this-p &lt; $p"><xsl:element name="mo">)</xsl:element></xsl:if>
</xsl:element >
</xsl:template>

<xsl:template name="set" >
<xsl:param name="o" select="'{'"/>
<xsl:param name="c" select="'}'"/>
<xsl:element name="mrow">
 <xsl:element name="mo"><xsl:value-of select="$o"/></xsl:element>
 <xsl:choose>
 <xsl:when test="condition">
 <xsl:element name="mrow"><xsl:apply-templates  select="bvar/*[not(self::bvar or self::condition)]"/></xsl:element >
 <xsl:element name="mo">|</xsl:element>
 <xsl:element name="mrow"><xsl:apply-templates  select="condition/node()"/></xsl:element >
 </xsl:when>
 <xsl:otherwise>
  <xsl:for-each select="*">
    <xsl:apply-templates  select="."/>
    <xsl:if test="position() !=last()"><xsl:element name="mo">,</xsl:element></xsl:if>
  </xsl:for-each>
 </xsl:otherwise>
 </xsl:choose>
 <xsl:element name="mo"><xsl:value-of select="$c"/></xsl:element>
</xsl:element >
</xsl:template>

</xsl:stylesheet>`;

export { ctop };
