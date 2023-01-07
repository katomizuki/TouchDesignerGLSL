uniform float uTime;
out vec4 fragColor;

void main()
{
	vec3 color = vec3(sin(vUV.s * 30 * uTime));
	fragColor = TDOutputSwizzle(vec4(vec3(color), 1.0));
}
