uniform vec3 uDX;
out vec4 fragColor;
void main()
{
	vec2 p = vUV.st;
	vec4 color = vec4(vec3(0.0), 1.0);
	color.r = texture(sTD2DInputs[0], p + vec2(uDX.r, uDX.r)).r;
	color.b = texture(sTD2DInputs[0], p + vec2(uDX.b, uDX.b)).b;
	color.g = texture(sTD2DInputs[0], p + vec2(uDX.g, uDX.g)).g;
	fragColor = TDOutputSwizzle(color);
}
