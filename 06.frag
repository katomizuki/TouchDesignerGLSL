uniform vec2 uResolution;
out vec4 fragColor;
void main()
{
	vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
	vec4 color = vec4(1.0);
	float d = length(p);
	d *= 2;
	d = smoothstep(0.95, 1, d);
	color.rgb = vec3(d);
	fragColor = TDOutputSwizzle(color);
}
