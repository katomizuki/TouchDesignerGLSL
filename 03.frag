out vec4 fragColor;
uniform float uRepeat;
void main()
{
	vec2 p = vUV.st;
	p -= vec2(0.5);
	p *= uRepeat;
	p += vec2(0.5);

  vec4 color = texture(sTD2DInputs[0], p);
	// vec4 color = vec4(p, .0, 1.);
	fragColor = TDOutputSwizzle(color);
}
