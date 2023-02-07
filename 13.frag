uniform vec2 uResolution;

out vec4 fragColor;
void main()
{
	vec2 position = (gl_FragCoord.xy / uResolution.xy);
	vec3[4] colors = vec3[](
		vec3(1,0,0),
		vec3(0,1,0),
		vec3(0,0,1),
		vec3(1,1,0)
	);
	vec3 finalColor = mix(mix(colors[0], colors[1], position.x), mix(colors[2], colors[3], position.x), position.y);
	fragColor = TDOutputSwizzle(vec4(finalColor, 1));
}
